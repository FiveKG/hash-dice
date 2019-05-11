// @ts-check
const { pool } = require("../../db");

/**
 * 查询用户的子帐号
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<any> }
 */
async function getUserSubAccount(accountName) {
    try {
        //  order by create_time asc
        let selectSubLevelSql = `
            select sub_account_name from sub_account where main_account = '${ accountName }';
        `
        // let { rows } = await pool.query(selectSubLevelSql, [accountName]);
        let { rows } = await pool.query(selectSubLevelSql);
        return rows;
    } catch (err) {
        throw err
    }
}

module.exports = getUserSubAccount;