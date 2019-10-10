// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "直接推荐PK奖金池分配" });
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { PK_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { getPkAccountList, updateSystemAmount } = require("../../models/systemPool");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
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
        if (pkPoolAmount.eq(0)) {
            return;
        }
        // 本次分配的金额
        let distrEnable = pkPoolAmount.mul(INCOME_CONSTANT.REFER_PK_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE);
        let pkAccountList = await getPkAccountList();
        if (pkAccountList.length === 0) {
            return;
        }
        logger.debug("pkAccountList: ", pkAccountList);
        for (let i = 0; i < pkAccountList.length; i++){
            let item = pkAccountList[i]
            let rate = setRate(i);
            let remark = `account ${ item.referrer_name }, income ${ distrEnable.mul(rate).toFixed(8) }`;
            let now = new Date();
            let data = {
                "account_name": item.referrer_name,
                "change_amount": distrEnable.mul(rate),
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": OPT_CONSTANTS.PK,
                "extra": { "symbol": UE_TOKEN_SYMBOL },
                "remark": remark
            }
            await storeIncome(item.referrer_name, OPT_CONSTANTS.PK, data);
        }

        let changeAmount = new Decimal(-distrEnable);
        let opType = OPT_CONSTANTS.PK;
        let remark = `allocating ${ PK_POOL }, minus ${ distrEnable }`;
        await updateSystemAmount(client, PK_POOL, changeAmount, rows.pool_amount, UE_TOKEN_SYMBOL);
        await insertSystemOpLog(client, changeAmount.toNumber(), rows.pool_amount, { "symbol": UE_TOKEN_SYMBOL, aid: PK_POOL }, opType, remark, "now()");
        await client.query("COMMIT");
        logger.debug(`handler ${ PK_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error(`handler ${ PK_POOL } pool error, the error stock is %O`, err);
        throw err;
    } finally {
        await client.release();
    }
}

/**
 * 
 * @param { number } rank 
 */
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