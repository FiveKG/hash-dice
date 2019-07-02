// @ts-check
const { generate_primary_key } = require("../../common");

/**
 * 添加推荐人
 * @param { any } client
 * @param { String } referrerName 推荐人
 * @param { String } accountName  被推荐用户
 */
async function insertReferrer(client, referrerName, accountName) {
    try {
        const sql = `
            insert into referrer (id, referrer_name, account_name, create_time) 
            values ($1, $2, $3, $4);
        `
        await client.query(sql, [ generate_primary_key(), referrerName, accountName, "now()" ]);
    } catch (err) {
        throw err
    }
}

module.exports = insertReferrer;