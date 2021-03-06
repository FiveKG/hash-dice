// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "五倍收益保障池分配" });
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { SAFE_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { getSafeAccountList, updateSystemAmount } = require("../../models/systemPool");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const storeIncome = require("../../common/storeIncome.js");
const { redis } = require("../../common/index.js");

/**
 * 五倍收益保障池分配
 */
async function handlerSafe() {
    let client = await pool.connect();
    await client.query("BEGIN");
    logger.debug(`begin handler ${ SAFE_POOL } pool, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    try {
        let rows = await getOneAccount(SAFE_POOL);
        if (!rows) {
            logger.debug(`system account ${ SAFE_POOL } not found`);
            throw Error(`system account ${ SAFE_POOL } not found`);
        }

        let safePoolAmount = new Decimal(rows.pool_amount);
        if (safePoolAmount.eq(0)) {
            return;
        }
        // 本次分配的金额
        let distrEnable = safePoolAmount.mul(INCOME_CONSTANT.SAFE_ALLOCATE_RATE).div(INCOME_CONSTANT.SAFE_ALLOCATE_RATE);
        logger.debug("distrEnable: ", distrEnable);
        let safeAccountList = await getSafeAccountList();
        logger.debug("safeAccountList: ", safeAccountList);
        if (safeAccountList.length === 0) {
            return;
        }

        // 用户的收益还包括 redis 里面未收取的部分
        const tmpList = [];
        let total = safeAccountList.map(it => it.total).reduce((pre, curr) => Number(pre) + Number(curr));
        logger.debug("total: ", total);
        for (const info of safeAccountList) {
            let incomeJson = await redis.hgetall(`tbg:income:${ info.account_name }`);
            logger.debug("incomeJson: ", incomeJson);
            let amount = new Decimal(info.total);
            for (let key in incomeJson) {
                let incomeArr = JSON.parse(incomeJson[key]);
                logger.debug("incomeArr: ", incomeArr);
                for (const item of incomeArr) {
                    logger.debug("item: ", item);
                    let changeAmount = new Decimal(item.change_amount);
                    amount = amount.add(changeAmount);
                }
            }

            total = amount.add(total).toNumber();
            const last = new Decimal(INCOME_CONSTANT.SAFE_OUT_LINE).minus(amount);
            logger.debug("last: ", last);
            // 如果收益低于三倍收益保障
            if (!last.lessThanOrEqualTo(INCOME_CONSTANT.SAFE_OUT_LINE)) {
                tmpList.push({
                    account_name: info.account_name,
                    last: last.toNumber()
                });
            }
        }

        const bonusList = tmpList.map(it => {
            return {
                account_name: it.account_name,
                last: it.last,
                all: total
            }
        });

        if (bonusList.length === 0) {
            return;
        }

        logger.debug("bonusList: ", bonusList);
        for (let item of bonusList) {
            let last = new Decimal(item.last);
            let rate = new Decimal(0);
            let total = new Decimal(item.all);
            // 一开始 total 可能为 0；
            if (total.eq(0)) {
                // 按人数均分
                rate = new Decimal(1).div(bonusList.length);
            } else {
                // 按比例均分
                rate = last.div(total);
            }
            let remark = `account ${ item.account_name }, income ${ distrEnable.mul(rate).toFixed(8) }`;
            let now = new Date();
            let data = {
                "account_name": item.account_name,
                "change_amount": distrEnable.mul(rate),
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": OPT_CONSTANTS.PROTECTION,
                "extra": { "symbol": UE_TOKEN_SYMBOL },
                "remark": remark
            }
            logger.debug("data: ", data);
            await storeIncome(item.account_name, OPT_CONSTANTS.PROTECTION, data);
        }

        let changeAmount = new Decimal(-distrEnable);
        let opType = OPT_CONSTANTS.PROTECTION;
        let remark = `allocating ${ SAFE_POOL }, minus ${ distrEnable }`;
        await updateSystemAmount(client, SAFE_POOL, changeAmount, rows.pool_amount, UE_TOKEN_SYMBOL);
        await insertSystemOpLog(client, changeAmount.toNumber(), rows.pool_amount, { "symbol": UE_TOKEN_SYMBOL, aid: SAFE_POOL }, opType, remark, "now()");
        await client.query("COMMIT");
        logger.debug(`handler ${ SAFE_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error(`handler ${ SAFE_POOL } pool error, the error stock is %O`, err);
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = handlerSafe