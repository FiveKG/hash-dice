// @ts-check
const { pool } = require("../../db");

/**
 * 随机获取一个用户名
 * @param { string } accountName
 * @param { string } [accountType]
 * @returns { Promise<any> }
 */
async function randomGetAccount(accountName, accountType) {
    try {
        let opts = [ accountName ]
        let whereStr = [ `account_name != $${ opts.length }` ];
        if (!!accountType) {
            opts.push(accountType);
            whereStr.push(`account_type = $${ opts.length }`);
        }
        let selectSql = `
            select account_name 
                from account 
                where ${ whereStr.join(" AND ") }
                order by random() limit 1;
        `
        let { rows: [ account_name ] } = await pool.query(selectSql, opts);
        return account_name;
    } catch (err) {
        throw err
    }
}

module.exports = randomGetAccount;
