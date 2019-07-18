// @ts-check
const { generate_primary_key } = require("../../common/index.js");

/**
 * 添加用户信息
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 用户名
 * @param { String } referCode 推荐码
 * @param { String } accountType 账号类型, 普通用户(general) 全球合伙人(global)
 */
async function insertAccount(client, accountName, referCode, accountType) {
    try {
        let sql = `
            INSERT INTO 
                account(id, account_name, refer_count, refer_code, state, account_type, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        const opts = [ generate_primary_key(), accountName, 0, referCode, 0, accountType, "now()" ]
        console.debug("the sql is %s, the values is %O", sql, opts);
        await client.query(sql, opts);
    } catch (err) {
        console.error("insert data to account error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertAccount;