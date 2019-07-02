// @ts-check
const { pool } = require("../../db");

/**
 * 获取用户的邀请码
 * @returns { Promise<any> }
 */
async function getInviteCode(accountName) {
    try {
        let selectSql = `
            select refer_code from account where account_name = $1
        `
        let { rows: [ inviteCode ] } = await pool.query(selectSql, [ accountName ]);
        return inviteCode;
    } catch (err) {
        throw err
    }
}

module.exports = getInviteCode;
