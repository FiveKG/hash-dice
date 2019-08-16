// @ts-check
const { Decimal } = require("decimal.js");

/**
 * 添加用户 tbg 资产信息
 * @param { any } client 指定的数据库实例
 * @param { Decimal } id 
 * @param { number } account_name  
 * @param { number } release_amount 释放池资产
 * @param { number } sell_amount 可售额度
 * @param { number } active_amount 可售余额
 * @param { any } create_time 插入数据的时间
 */
async function insertTbgBalance(client, id, account_name, release_amount, sell_amount, active_amount, create_time) {
    try {
       
        let sql = `
            insert into 
                tbg_balance(id, account_name, release_amount, sell_amount, active_amount, create_time)
                values($1, $2, $3, $4, $5, $6);
        `
        const opts = [ id, account_name, release_amount, sell_amount, active_amount, create_time ]
        await client.query(sql, opts);
    } catch (err) {
        console.error("insert into tbg_balance error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertTbgBalance;