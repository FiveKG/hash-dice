// @ts-check
const { pool } = require("../../db");

/**
 * 查询用户的子帐号
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<DB.SubAccount[]> }
 */
async function getUserSubAccount(accountName) {
    try {
        let selectSubLevelSql = `
            select * from sub_account where main_account = $1;
        `
        let { rows } = await pool.query(selectSubLevelSql, [ accountName ]);
        return rows;
    } catch (err) {
        throw err
    }
}

module.exports = getUserSubAccount;