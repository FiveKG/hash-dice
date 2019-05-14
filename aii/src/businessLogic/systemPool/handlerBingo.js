// @ts-check
const { pool } = require("../../db");
const { getOneAccount } = require("../../models/systemPool");
const { BINGO_POOL } = require("../../common/constant/accountConstant.js");
const { personalAssetChange, systemAssetChange } = require("../../models/asset");
const { getBingoAccountList } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const logger = require("../../common/logger.js");
const storeIncome = require("../../common/storeIncome.js");
const redis = require("../../common/redis.js");
const df = require("date-fns");

/**
 * 直接推荐PK奖金池分配
 */
async function handlerPk() {
    let client = await pool.connect();
    logger.debug(`begin handler ${ BINGO_POOL } pool, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    await client.query("BEGIN");
    try {
        let rows = await getOneAccount(BINGO_POOL);
        if (!rows) {
            logger.debug(`system account ${ BINGO_POOL } not found`);
            return;
        }

        let pkPoolAmount = new Decimal(rows.pool_amount);
        // 本次分配的金额
        let distrEnable = pkPoolAmount.mul(70 / 100);
        let bingoAccountList = await getBingoAccountList();
        console.log("bingoAccountList: ", bingoAccountList)
        for (let i = 0; i< bingoAccountList.length; i++){
            let item = bingoAccountList[i]
            let rate = 0;
            if (i === 0) {
                rate = 50 / 100;
            } else {
                rate = 50 / 100 / (bingoAccountList.length - 1);
            }
            let opType = `bingo income`;
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
            await storeIncome(item.account_name, "bingo", data);
            // await redis.hset(`${ item.account_name }`, "bingo:opType", opType);
            // await redis.hset(`${ item.account_name }`, "bingo:remark", remark);
        };

        let changeAmount = new Decimal(-distrEnable);
        let opType = `allocating ${ BINGO_POOL }`;
        let remark = `allocating ${ BINGO_POOL }, minus ${ distrEnable }`;
        await systemAssetChange(client, BINGO_POOL, changeAmount, rows.pool_amount, opType, remark);
        await client.query("COMMIT");
        logger.debug(`handler ${ BINGO_POOL } pool over, ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
    } catch (err) {
        await client.query("ROLLBACK")
        throw err;
    }
}

module.exports = handlerPk