// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "股东分红池分配" });
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { getHolderAccountList, updateSystemAmount } = require("../../models/systemPool");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const { redis } = require("../../common");
const storeIncome = require("../../common/storeIncome.js");

/**
 * 股东分红池分配
 */
async function handlerHolder() {
    let client = await pool.connect();
    logger.debug(`begin handler ${ SHAREHOLDERS_POOL } pool, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    await client.query("BEGIN");
    try {
        let rows = await getOneAccount(SHAREHOLDERS_POOL);
        if (!rows) {
            logger.warn(`system account ${ SHAREHOLDERS_POOL } not found`);
            throw Error(`system account ${ SHAREHOLDERS_POOL } not found`);
        }

        let holderPoolAmount = new Decimal(rows.pool_amount);
        if (holderPoolAmount.eq(0)) {
            return;
        }
        // 本次分配的金额
        let distrEnable = holderPoolAmount.mul(INCOME_CONSTANT.SHAREHOLDERS_ALLOCATE_RATE).div(INCOME_CONSTANT.BASE_RATE);
        let holderAccountList = await getHolderAccountList();
        if (holderAccountList.length === 0) {
            return;
        }
        // 计算每个 TBG 可以分配多少个额度
        const total = holderAccountList.map(it => it.sell_amount).reduce((pre, curr) => Number(pre) + Number(curr));
        const bonus = distrEnable.div(total);
        // 获取当前的期数
        let periods = await redis.get(`tbg:periods:${SHAREHOLDERS_POOL}`);
        let currPeriods = 1
        if(!!periods) {
            currPeriods = parseInt(periods);
        }
        logger.debug("holderAccountList: ", holderAccountList);
        for (let item of holderAccountList) {
            const changeAmount = bonus.mul(item.sell_amount).toFixed(8);
            let remark = `account ${ item.account_name }, income ${ changeAmount }`;
            let now = new Date();
            let data = {
                "account_name": item.account_name,
                "change_amount": changeAmount,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": OPT_CONSTANTS.HOLDER,
                "extra": { "symbol": UE_TOKEN_SYMBOL, periods: currPeriods },
                "remark": remark
            }
            await storeIncome(item.account_name, OPT_CONSTANTS.HOLDER, data);
        };

        let changeAmount = new Decimal(-distrEnable);
        let opType = OPT_CONSTANTS.HOLDER;
        let remark = `allocating ${ SHAREHOLDERS_POOL }, minus ${ distrEnable }`;
        await updateSystemAmount(client, SHAREHOLDERS_POOL, changeAmount, rows.pool_amount, UE_TOKEN_SYMBOL);
        await insertSystemOpLog(client, changeAmount.toNumber(), rows.pool_amount, { "symbol": UE_TOKEN_SYMBOL, aid: SHAREHOLDERS_POOL, periods: currPeriods }, opType, remark, "now()");
        await client.query("COMMIT");
        await redis.set(`tbg:periods:${SHAREHOLDERS_POOL}`, currPeriods + 1);
        logger.debug(`handler ${ SHAREHOLDERS_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error(`handler ${ SHAREHOLDERS_POOL } pool error, the error stock is %O`, err);
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = handlerHolder