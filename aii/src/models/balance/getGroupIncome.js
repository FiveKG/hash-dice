// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取用户收入记录并分组
 * @param { String } accountName
 * @returns { Promise<any[]> }
 */
async function getGroupIncome(accountName) {
    try {
        let selectSql = `
            select op_type, account_name, sum(change_amount) as total
                from balance_log where account_name = '${ accountName }' 
                group by op_type, account_name;
        `
        let selectResult = await pool.query(selectSql);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getGroupIncome;