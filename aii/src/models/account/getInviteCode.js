// @ts-check
const { pool } = require("../../db");

/**
 * 获取用户的邀请码
 * @returns { Promise<any> }
 */
async function getInviteCode(accountName) {
    try {
        let selectSql = `
            select refer_code from account where account_name = '${ accountName }'
        `
        let { rows } = await pool.query(selectSql);
        return rows[0];
    } catch (err) {
        throw err
    }
}

module.exports = getInviteCode;
