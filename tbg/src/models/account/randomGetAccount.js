// @ts-check
const { pool } = require("../../db");

/**
 * 随机获取一个用户名
 * @param { String } accountName
 * @returns { Promise<any> }
 */
async function randomGetAccount(accountName) {
    try {
        let selectSql = `
            select account_name 
                from account 
                where account_name != $1
                order by random() limit 1;
        `
        let { rows: [ { account_name } ] } = await pool.query(selectSql, [ accountName ]);
        return account_name;
    } catch (err) {
        throw err
    }
}

module.exports = randomGetAccount;
