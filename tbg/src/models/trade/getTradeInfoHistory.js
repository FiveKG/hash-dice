// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/trade/getTradeInfoHistory.js": "获取交易信息" });

/**
 * 获取交易信息
 * @param { string } accountName 用户账户名
 * @param { String } tradeType 资产包类型
 * @param { String } [ state ] 交易状态
 * @returns { Promise<DB.Trade[]> }
 */
async function getTradeInfoHistory(accountName, tradeType, state) {
    try {
        const opts = [ accountName ];
        const values = [ `account_name = ${ opts.length }` ];
        if (tradeType === "sell") {
            opts.push(tradeType);
            values.push(`trade_type = ${ opts.length }`)
        } else {
            opts.push("sell");
            values.push(`trade_type != ${ opts.length }`);
        }

        if (!!state) {
            opts.push(state);
            values.push(`state = ${ opts.length }`)
        }

        const sql = `
            SELECT * FROM trade WHERE ${ values.join(" AND ") }
        `
        const { rows } = await pool.query(sql, opts);
        return rows;
    } catch (err) {
        logger.error("get trade info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getTradeInfoHistory;