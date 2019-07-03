// @ts-check
const { pool } = require("../../db");

/**
 * 获取所有邀请的用户
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<any> }
 */
async function getAllInviteAccount(accountName) {
    try {
        let selectSubParentLevelSql = `
            select r.account_name, a.member_level from account a 
                join referrer r on r.referrer_name = a.account_name 
                where length(r.account_name) = 12 and r.referrer_name = $1;
        `
        let { rows } = await pool.query(selectSubParentLevelSql, [ accountName ]);
        return rows;
    } catch (err) {
        throw err
    }
}

module.exports = getAllInviteAccount;
