// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/trade/getTradeInfo.js": "获取交易信息" });

/**
 * 获取交易信息
 * @param { string } accountName 用户账户名
 * @param { String? } tradeType 资产包类型
 * @returns { Promise<DB.Trade[]> }
 */
async function getTradeInfo(accountName, tradeType) {
    try {
        const sql = `
            SELECT * FROM trade WHERE account_name = $1 AND trade_type = COALESCE($2, trade_type)
        `
        const { rows } = await pool.query(sql, [ accountName, !tradeType ? null : tradeType ]);
        return rows;
    } catch (err) {
        logger.error("get trade info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getTradeInfo;