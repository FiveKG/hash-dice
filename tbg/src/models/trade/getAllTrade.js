// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/trade/getAllTrade.js": "获取所有交易信息" });

/**
 * 获取所有交易信息
 * @param { String } tradeType 交易类型，买或者买
 * @param { string } tradeState 交易状态
 * @returns { Promise<DB.Trade[]> }
 */
async function getAllTrade(tradeType, tradeState) {
    try {
        const sql = `
            SELECT * FROM trade 
                WHERE trade_type = $1 
                AND state  = $2 
                ORDER BY create_time DESC

        `
        const { rows } = await pool.query(sql, [ tradeType, tradeState ]);
        return rows;
    } catch (err) {
        logger.error("get trade log info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getAllTrade;