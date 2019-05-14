// @ts-check
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { SAFE_POOL } = require("../../common/constant/accountConstant.js");
const { personalAssetChange, systemAssetChange } = require("../../models/asset");
const { getSafeAccountList } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const logger = require("../../common/logger.js");
const storeIncome = require("../../common/storeIncome.js");

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
            return;
        }

        let safePoolAmount = new Decimal(rows.pool_amount);
        // 本次分配的金额
        let distrEnable = safePoolAmount.mul(30 / 100);
        let safeAccountList = await getSafeAccountList();
        console.log("safeAccountList: ", safeAccountList);
        for (let item of safeAccountList) {
            let last = new Decimal(item.last);
            let total = new Decimal(item.all);
            let rate = last.div(total);
            let opType = `safe income`;
            let remark = `account ${ item.account_name }, income ${ distrEnable.mul(rate).toFixed(8) }`;
            // await personalAssetChange(client, item.account_name, distrEnable.mul(rate), opType, remark);
            let now = new Date();
            let data = {
                "account_name": item.account_name,
                "change_amount": distrEnable.mul(rate),
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": opType,
                "remark": remark
            }
            await storeIncome(item.account_name, "safe", data);
        }

        let changeAmount = new Decimal(-distrEnable);
        let opType = `allocating ${ SAFE_POOL }`;
        let remark = `allocating ${ SAFE_POOL }, minus ${ distrEnable }`;
        await systemAssetChange(client, SAFE_POOL, changeAmount, rows.pool_amount, opType, remark);
        await client.query("COMMIT");
        logger.debug(`handler ${ SAFE_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK")
        throw err;
    }
}

module.exports = handlerSafe