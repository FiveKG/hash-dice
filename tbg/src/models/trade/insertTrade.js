// @ts-check
const logger = require("../../common/logger.js").child({ "@models/trade/insertTrade.js": "插入交易信息" });

/**
 * 插入交易信息
 * @param { any } client 指定的数据库实例
 * @param { string } id 交易 id
 * @param { string } accountName 用户账户名
 * @param { string } tradeType 交易类型
 * @param { object } apId 资产包 id
 * @param { number } amount 交易数量
 * @param { number } trx_amount 成交数量
 * @param { number } price 交易价格
 * @param { string } state 交易状态
 * @param { string } create_time 交易创建时间
 * @param { string } finished_time 交易完成时间
 */
async function insertTrade(client, id, accountName, tradeType, apId, amount, trx_amount, price, state, create_time, finished_time) {
    try {
        const sql = `
            INSERT INTO trade(id, account_name, trade_type, extra, amount, trx_amount, price, state, create_time, finished_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `
        const opts = [ id, accountName, tradeType, apId, amount, trx_amount, price, state, create_time, finished_time ];
        logger.debug(sql, opts);
        await client.query(sql, opts);
    } catch (err) {
        logger.error("insert data to trade error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertTrade;