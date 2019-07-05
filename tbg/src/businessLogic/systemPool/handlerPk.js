// @ts-check
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { PK_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const { getPkAccountList, updateSystemAmount } = require("../../models/systemPool");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const logger = require("../../common/logger.js");
const storeIncome = require("../../common/storeIncome.js");

/**
 * 直接推荐PK奖金池分配
 */
async function handlerPk() {
    let client = await pool.connect();
    logger.debug(`begin handler ${ PK_POOL } pool, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    await client.query("BEGIN");
    try {
        let rows = await getOneAccount(PK_POOL);
        if (!rows) {
            logger.warn(`system account ${ PK_POOL } not found`);
            throw Error(`system account ${ PK_POOL } not found`);
        }

        let pkPoolAmount = new Decimal(rows.pool_amount);
        // 本次分配的金额
        let distrEnable = pkPoolAmount.mul(INCOME_CONSTANT.REFER_PK_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE);
        let pkAccountList = await getPkAccountList();
        console.log("pkAccountList: ", pkAccountList);
        for (let i = 0; i < pkAccountList.length - 5; i++){
            let item = pkAccountList[i]
            let rate = setRate(i);
            let opType = `pk income`;
            let remark = `account ${ item.referrer_name }, income ${ distrEnable.mul(rate).toFixed(8) }`;
            let now = new Date();
            let data = {
                "account_name": item.referrer_name,
                "change_amount": distrEnable.mul(rate),
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": opType,
                "remark": remark
            }
            await storeIncome(item.referrer_name, "pk", data);
        }

        let changeAmount = new Decimal(-distrEnable);
        let opType = `allocating ${ PK_POOL }`;
        let remark = `allocating ${ PK_POOL }, minus ${ distrEnable }`;
        await updateSystemAmount(client, PK_POOL, changeAmount, rows.pool_amount);
        await insertSystemOpLog(client, changeAmount, rows.pool_amount, opType, remark);
        await client.query("COMMIT");
        logger.debug(`handler ${ PK_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK")
        throw err;
    } finally {
        await client.release();
    }
}

function setRate(rank) {
    let rate = 0;
    if (rank === 0) {
        rate = INCOME_CONSTANT.PK_INCOME_FIRST / INCOME_CONSTANT.BASE_RATE;
    } else if (rank === 1) {
        rate = INCOME_CONSTANT.PK_INCOME_SECOND / INCOME_CONSTANT.BASE_RATE;
    } else if (rank === 2) {
        rate = INCOME_CONSTANT.PK_INCOME_THIRD / INCOME_CONSTANT.BASE_RATE;
    } else if (rank === 3) {
        rate = INCOME_CONSTANT.PK_INCOME_FOURTH / INCOME_CONSTANT.BASE_RATE;
    } else {
        rate = INCOME_CONSTANT.PK_INCOME_FIFTH / INCOME_CONSTANT.BASE_RATE;
    }

    return rate;
}

module.exports = handlerPk