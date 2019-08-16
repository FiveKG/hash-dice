// @ts-check
const logger = require("../../common/logger")

/**
 * 记录系统资产变动日志
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 资产类型
 * @param { any } changeAmount 变动的额度
 * @param { any } currentBalance 当前余额
 * @param { String } opType 操作类型
 * @param { object } extra 附加信息
 * @param { String } remark 备注
 * @param { any } now 插入数据的时间
 */
async function insertBalanceLog(client, accountName, changeAmount, currentBalance, opType, extra, remark, now) {
    try {
        let sql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra， remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        const opts = [ accountName, changeAmount, currentBalance, opType, extra, remark, now ]
        logger.debug("sql: %s, opts: %O", sql, opts);
        await client.query(sql, opts);
    } catch (err) {
        logger.error("insert data to balance_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertBalanceLog;