// @ts-check
const { Decimal } = require("decimal.js");

/**
 * 记录系统资产变动日志
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 资产类型
 * @param { Decimal } changeAmount 变动的额度
 * @param { Decimal } currentBalance 当前余额
 * @param { String } opType 操作类型
 * @param { String } remark 备注
 * @param { any } now 插入数据的时间
 */
async function insertBalanceLog(client, accountName, changeAmount, currentBalance, opType, remark, now) {
    try {
        let sql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6);
        `
        console.log(`now: ${ now } currentBalance: ${ currentBalance } -- sql: ${ sql }`);
        const opts = [ accountName, changeAmount, currentBalance, opType, remark, now ]
        await client.query(sql, opts);
    } catch (err) {
        console.error("insert data to balance_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertBalanceLog;