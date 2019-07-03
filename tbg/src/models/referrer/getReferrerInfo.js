// @ts-check
const { pool } = require("../../db");

/**
 * 获取投资用户的推荐人
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<any> }
 */
async function getReferrerInfo(accountName) {
    try {
        let selectSql = `
            SELECT referrer_name FROM referrer WHERE account_name = $1
        `
        let { rows: [ { referrer_name } ] } = await pool.query(selectSql, [ accountName ]);
        return referrer_name;
    } catch (err) {
        throw err
    }
}

module.exports = getReferrerInfo;