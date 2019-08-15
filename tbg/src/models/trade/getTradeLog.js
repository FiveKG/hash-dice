// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/trade/getTradeLog.js": "获取交易日志信息" });

/**
 * 获取交易日志信息
 * @param { String } amountType 资产包类型
 * @returns { Promise<DB.Trade_log[]> }
 */
async function getTradeLog(amountType) {
    try {
        const sql = `
            SELECT * FROM trade_log WHERE amount_type = $1
        `
        const { rows } = await pool.query(sql, [ amountType ]);
        return rows;
    } catch (err) {
        logger.error("get trade info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getTradeLog;