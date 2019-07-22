// @ts-check
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const { getHolderAccountList, updateSystemAmount } = require("../../models/systemPool");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const logger = require("../../common/logger.js");
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
        // 本次分配的金额
        let distrEnable = holderPoolAmount.mul(INCOME_CONSTANT.SHAREHOLDERS_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE);
        let holderAccountList = await getHolderAccountList();
        console.log("holderAccountList: ", holderAccountList);
        for (let item of holderAccountList) {
            let total = new Decimal(item.total);
            let all = new Decimal(item.all);
            let rate = total.div(all);
            let opType = `holder income`;
            let remark = `account ${ item.referrer_name }, income ${ distrEnable.mul(rate).toFixed(8) }`;
            // await personalAssetChange(client, item.referrer_name, distrEnable.mul(rate), opType, remark);
            let now = new Date();
            let data = {
                "account_name": item.referrer_name,
                "change_amount": distrEnable.mul(rate),
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": opType,
                "remark": remark
            }
            await storeIncome(item.referrer_name, "holder", data);
        };

        let changeAmount = new Decimal(-distrEnable);
        let opType = `allocating ${ SHAREHOLDERS_POOL }`;
        let remark = `allocating ${ SHAREHOLDERS_POOL }, minus ${ distrEnable }`;
        await updateSystemAmount(client, SHAREHOLDERS_POOL, changeAmount, rows.pool_amount);
        await insertSystemOpLog(client, changeAmount, rows.pool_amount, opType, remark);
        await client.query("COMMIT");
        logger.debug(`handler ${ SHAREHOLDERS_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK")
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = handlerHolder