// @ts-check
const logger = require("../../common/logger.js").child({ "@models/trade/insertTradeLog.js": "插入交易日志" });

/**
 * 插入交易日志
 * @param { any } client 指定的数据库实例
 * @param { string } id 交易日志 id
 * @param { string } tr_id 交易 id
 * @param { string } account_name 交易用户
 * @param { string } trade_type 交易类型
 * @param { number } amount 交易数量
 * @param { string } memo 备注
 * @param { number } price 交易价格
 * @param { number } volume 成交金额 价格 * 数量
 * @param { string } create_time 交易创建时间
 */
async function insertTradeLog(client, id, tr_id, account_name, trade_type, amount, memo, price, volume, create_time) {
    try {
        const sql = `
            INSERT INTO trade_log(id, tr_id, account_name, trade_type, amount, memo, price, state, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `
        await client.query(sql, [ id, tr_id, account_name, trade_type, amount, memo, price, volume, create_time]);
    } catch (err) {
        logger.error("insert data to trade_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertTradeLog;