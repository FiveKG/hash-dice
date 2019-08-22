// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/trade/getTradeInfoHistory.js": "获取交易信息" });

/**
 * @typedef { object } TradeTrx
 * @property { string } [ accountName ] 用户账户名
 * @property { String } tradeType 资产包类型
 * @property { String } [ state ] 交易状态
 * @property { String } orderBy 排序类型
 */

/**
 * 获取交易信息
 * @param { TradeTrx } params
 * @returns { Promise<DB.Trade[]> }
 */
async function getTradeInfoHistory(params) {
    try {
        const { tradeType, state, accountName, orderBy } = params;
        const opts = [];
        const values = [];

        if (!!accountName) {
            opts.push(accountName);
            values.push(`account_name = $${ opts.length }`);
        }
        
        if (tradeType === "sell") {
            opts.push(tradeType);
            values.push(`trade_type = $${ opts.length }`)
        } else {
            opts.push("sell");
            values.push(`trade_type != $${ opts.length }`);
        }

        if (!!state) {
            opts.push(state);
            values.push(`state = $${ opts.length }`);
        }

        const sql = `
            SELECT * FROM trade 
                WHERE ${ values.join(" AND ") } 
                ORDER BY create_time ${ orderBy }
        `
        const { rows } = await pool.query(sql, opts);
        return rows;
    } catch (err) {
        logger.error("get trade info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getTradeInfoHistory;