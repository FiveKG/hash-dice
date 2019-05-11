// @ts-check
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");
const { personalAssetChange, systemAssetChange } = require("../../models/asset");
const { getHolderAccountList } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const logger = require("../../common/logger.js");
const storeIncome = require("../../common/storeIncome.js");

/**
 * 股东分红池分配
 */
async function handlerHolder() {
    let client = await pool.connect();
    await client.query("BEGIN");
    try {
        let rows = await getOneAccount(SHAREHOLDERS_POOL);
        if (!rows) {
            logger.debug(`system account ${ SHAREHOLDERS_POOL } not found`);
            return;
        }

        let holderPoolAmount = new Decimal(rows.pool_amount);
        // 本次分配的金额
        let distrEnable = holderPoolAmount.mul(30 / 100);
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
            // await storeIncome(item.referrer_name, distrEnable, "holder", rate.toNumber());
            // await redis.hset(`${ item.referrer_name }`, "holder:opType", opType);
            // await redis.hset(`${ item.referrer_name }`, "holder:remark", remark);
        };

        let changeAmount = new Decimal(-distrEnable);
        let opType = `allocating ${ SHAREHOLDERS_POOL }`;
        let remark = `allocating ${ SHAREHOLDERS_POOL }, minus ${ distrEnable }`;
        await systemAssetChange(client, SHAREHOLDERS_POOL, changeAmount, rows.pool_amount, opType, remark);
        await client.query("COMMIT")
    } catch (err) {
        await client.query("ROLLBACK")
        throw err;
    }
}

module.exports = handlerHolder