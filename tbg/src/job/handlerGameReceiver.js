// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "处理游戏分配过来的收益" });
const { Decimal } = require("decimal.js");
const { getAllTrade } = require("../models/trade");
const { format } = require("date-fns");

/**
 * 处理游戏分配过来的收益
 * "globallotto", "treasure", "luckyhongbao", "hashdice", "minlottery"
 * @param {{ "account_name": string, "game_name": string, "game_amount": number, "amount": number }} data
 */
async function handlerGameReceiver(data) {
    try {
        const trxList = [];
        let tmpActions = [];

        if (data.game_name === "globallotto") {

        } else if (data.game_name === "luckyhongbao") {

        } else if (data.game_name === "treasure") {

        } else if (data.game_name === "hashdice") {

        } else if (data.game_name === "minlottery") {

        } else {

        }

        // logger.debug("trxList: ", trxList);
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        // 一笔交易完成，才对用户执行空投及相关的转账操作
        if (tmpActions.length !== 0) {
            await psTrx.pub(tmpActions);
        }
    } catch (err) {
        logger.error("sell assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = handlerGameReceiver