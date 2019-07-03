// @ts-check
const { generate_primary_key } = require("../../common/index.js");

/**
 * 添加资产信息
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 用户名
 */
async function insertBalance(client, accountName) {
    try {
        let sql = `
            INSERT INTO 
                balance(id, account_name, create_time)
                VALUES($1, $2, $3);
        `
        const opts = [ generate_primary_key(), accountName, 0, "now()" ]
        console.debug("the sql is %s, the values is %O", sql, opts);
        await client.query(sql, opts);
    } catch (err) {
        console.error("insert data to balance error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertBalance;