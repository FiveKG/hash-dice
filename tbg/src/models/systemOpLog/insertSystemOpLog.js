// @ts-check
const { Decimal } = require("decimal.js");

/**
 * 添加系统资产变动日志
 * @param { any } client 指定的数据库实例
 * @param { number } changeAmount 变动的额度
 * @param { number } preAmount  变动前的额度
 * @param { object } extra 附加信息
 * @param { String } opType 操作类型
 * @param { String } remark 备注
 * @param { any } createTime 插入数据的时间
 */
async function insertSystemOpLog(client, changeAmount, preAmount, extra, opType, remark, createTime) {
    try {
        let currentBalance = new Decimal(changeAmount).add(preAmount).toFixed(8);
        let sql = `
            insert into 
                system_op_log(change_amount, current_balance, extra, op_type, remark, create_time)
                values($1, $2, $3, $4, $5, $6);
        `
        const opts = [ new Decimal(changeAmount).toFixed(8), currentBalance, extra, opType, remark, createTime ]
        await client.query(sql, opts);
    } catch (err) {
        console.error("insert into system_op_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertSystemOpLog;