// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/trade/getTradeInfoById.js": "获取交易信息" });

/**
 * 获取交易信息
 * @param { String } trId 交易 id
 * @returns { Promise<DB.Trade[]> }
 */
async function getTradeInfoById(trId) {
    try {
        const sql = `
            SELECT * FROM trade WHERE id = any($1) AND state = $2
        `
        const { rows: tradeInfo } = await pool.query(sql, [ trId.split(","), "finished" ]);
        return tradeInfo;
    } catch (err) {
        logger.error("get trade info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getTradeInfoById;