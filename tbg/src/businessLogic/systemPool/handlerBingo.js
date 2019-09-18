// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "bingo 奖金池分配" });
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { BINGO_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const { getBingoAccountList, updateSystemAmount } = require("../../models/systemPool");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { Decimal } = require("decimal.js");
const { redis } = require("../../common");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");

/**
 * bingo 奖金池分配
 */
async function handlerPk() {
    let client = await pool.connect();
    logger.debug(`begin handler ${ BINGO_POOL } pool, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    await client.query("BEGIN");
    try {
        let rows = await getOneAccount(BINGO_POOL);
        if (!rows) {
            logger.warn(`system account ${ BINGO_POOL } not found`);
            throw Error(`system account ${ BINGO_POOL } not found`);
        }

        let bingoPoolAmount = new Decimal(rows.pool_amount);
        if (bingoPoolAmount.eq(0)) {
            return;
        }
        // 本次分配的金额
        let distrEnable = bingoPoolAmount.mul(INCOME_CONSTANT.BINGO_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE);
        let bingoAccountList = await getBingoAccountList();
        if (bingoAccountList.length === 0) {
            return;
        }

        // 获取当前的期数
        let periods = await redis.get(`tbg:periods:${BINGO_POOL}`);
        let currPeriods = 1
        if(!!periods) {
            currPeriods = parseInt(periods);
        }
        
        logger.debug("bingoAccountList: ", bingoAccountList)
        for (let i = 0; i< bingoAccountList.length; i++){
            let item = bingoAccountList[i]
            let rate = 0;
            // 最后一名投资者
            if (i === 0) {
                rate = INCOME_CONSTANT.BINGO_INCOME_FIRST / INCOME_CONSTANT.BASE_RATE;
            } else {
                rate = INCOME_CONSTANT.BINGO_INCOME_OTHER / INCOME_CONSTANT.BASE_RATE / (bingoAccountList.length - 1);
            }
            let remark = `account ${ item.account_name }, income ${ distrEnable.mul(rate).toFixed(8) }`;
            let now = new Date();
            let data = {
                "account_name": item.account_name,
                "change_amount": distrEnable.mul(rate),
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": OPT_CONSTANTS.BINGO,
                "extra": { "symbol": UE_TOKEN_SYMBOL, periods: currPeriods },
                "remark": remark
            }
            await storeIncome(item.account_name, OPT_CONSTANTS.BINGO, data);
        };

        let changeAmount = new Decimal(-distrEnable);
        let opType = OPT_CONSTANTS.BINGO;
        let remark = `allocating ${ BINGO_POOL }, minus ${ distrEnable }`;
        await updateSystemAmount(client, BINGO_POOL, changeAmount, rows.pool_amount, UE_TOKEN_SYMBOL);
        await insertSystemOpLog(client, changeAmount.toNumber(), rows.pool_amount, { "symbol": UE_TOKEN_SYMBOL, aid: BINGO_POOL, periods: currPeriods }, opType, remark, "now()");
        await client.query("COMMIT");
        await redis.set(`tbg:periods:${BINGO_POOL}`, currPeriods + 1);
        logger.debug(`handler ${ BINGO_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error(`handler ${ BINGO_POOL } pool error, the error stock is %O`, err);
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = handlerPk