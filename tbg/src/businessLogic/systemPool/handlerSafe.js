// @ts-check
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
const logger = require("../../common/logger.js");
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
        let distrEnable = safePoolAmount.mul(INCOME_CONSTANT.SAFE_ALLOCATE_RATE / INCOME_CONSTANT.SAFE_ALLOCATE_RATE);
        let safeAccountList = await getSafeAccountList();
        if (safeAccountList.length === 0) {
            return;
        }

        // 用户的收益还包括 redis 里面未收取的部分
        const tmpList = [];
        let total = safeAccountList.map(it => it.total).reduce((pre, curr) => Number(pre) + Number(curr));
        for (const info of safeAccountList) {
            let incomeJsonIfy = await redis.hgetall(`tbg:income:${ info.account_name }`);
            let incomeArr = JSON.parse(incomeJsonIfy);
            let amount = new Decimal(info.total);
            for (let item of incomeArr) {
                let changeAmount = new Decimal(item.change_amount);
                amount = amount.add(changeAmount);
            }

            total = amount.add(total).toNumber();
            const last = new Decimal(INCOME_CONSTANT.SAFE_OUT_LINE).minus(amount);
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

        logger.log("bonusList: ", bonusList);
        for (let item of bonusList) {
            let last = new Decimal(item.last);
            let total = new Decimal(item.all);
            let rate = last.div(total);
            let remark = `account ${ item.account_name }, income ${ distrEnable.mul(rate).toFixed(8) }`;
            let now = new Date();
            let data = {
                "account_name": item.account_name,
                "change_amount": distrEnable.mul(rate),
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": OPT_CONSTANTS.PROTECTION,
                "remark": remark
            }
            await storeIncome(item.account_name, OPT_CONSTANTS.PROTECTION, data);
        }

        let changeAmount = new Decimal(-distrEnable);
        let opType = `allocating ${ SAFE_POOL }`;
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