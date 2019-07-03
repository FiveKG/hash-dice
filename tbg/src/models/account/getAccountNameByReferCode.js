// @ts-check
const { pool } = require("../../db");

/**
 * 根据邀请码获取用户名
 * @param { String } inviteCode
 * @returns { Promise<any> }
 */
async function getAccountNameByReferCode(inviteCode) {
    try {
        let selectSql = `
            select account_name from account where refer_code = $1;
        `
        let { rows: [ { account_name } ] } = await pool.query(selectSql, [ inviteCode ]);
        return account_name;
    } catch (err) {
        throw err
    }
}

module.exports = getAccountNameByReferCode;
