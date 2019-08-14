// @ts-check
const logger = require("../../common/logger.js").child({ "@models/asset/insertAssertsPackage.js": "用户提现" });
const { Decimal } = require("decimal.js");
const generate_primary_key = require("../../common/generate_primary_key.js");

/**
 * 插入用户购买的资产包信息
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 用户账户名
 * @param { number } apId 资产包 id
 * @param { number } state 
 */
async function insertAssertsPackage(client, accountName, apId, state) {
    try {
        const sql = `
            INSERT INTO user_assets_package(id, account_name, ap_id, state, create_time)
                VALUES($1, $2, $3, $4, $5);
        `
        await client.query(sql, [ generate_primary_key(), accountName, apId, state, "now()"]);
    } catch (err) {
        logger.error("insert data to user_assets_package error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertAssertsPackage;