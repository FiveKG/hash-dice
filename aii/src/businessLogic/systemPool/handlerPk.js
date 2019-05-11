// @ts-check
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { PK_POOL } = require("../../common/constant/accountConstant.js");
const { personalAssetChange, systemAssetChange } = require("../../models/asset");
const { getPkAccountList } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const logger = require("../../common/logger.js");
const storeIncome = require("../../common/storeIncome.js");

/**
 * 直接推荐PK奖金池分配
 */
async function handlerPk() {
    let client = await pool.connect();
    await client.query("BEGIN");
    try {
        let rows = await getOneAccount(PK_POOL);
        if (!rows) {
            logger.debug(`system account ${ PK_POOL } not found`);
            return;
        }

        let pkPoolAmount = new Decimal(rows.pool_amount);
        // 本次分配的金额
        let distrEnable = pkPoolAmount.mul(50 / 100);
        let pkAccountList = await getPkAccountList();
        console.log("pkAccountList: ", pkAccountList);
        for (let i = 0; i < pkAccountList.length - 5; i++){
            let item = pkAccountList[i]
            let rate = setRate(i);
            let opType = `pk income`;
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
            await storeIncome(item.referrer_name, "pk", data);
            // await redis.hset(`${ item.referrer_name }`, "pk:opType", opType);
            // await redis.hset(`${ item.referrer_name }`, "pk:remark", remark);
        }

        let changeAmount = new Decimal(-distrEnable);
        let opType = `allocating ${ PK_POOL }`;
        let remark = `allocating ${ PK_POOL }, minus ${ distrEnable }`;
        await systemAssetChange(client, PK_POOL, changeAmount, rows.pool_amount, opType, remark);
        await client.query("COMMIT")
    } catch (err) {
        await client.query("ROLLBACK")
        throw err;
    }
}

function setRate(rank) {
    let rate = 0;
    if (rank === 0) {
        rate = 40 / 100;
    } else if (rank === 1) {
        rate = 30 / 100;
    } else if (rank === 2) {
        rate = 15 / 100;
    } else if (rank === 3) {
        rate = 10 / 100;
    } else {
        rate = 5 / 100;
    }

    return rate;
}

module.exports = handlerPk