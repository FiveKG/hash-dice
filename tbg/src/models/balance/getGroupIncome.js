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
            SELECT op_type, account_name, sum(change_amount) AS total
                FROM balance_log 
                WHERE account_name = $1
                AND extra->>'symbol' = 'UE'
                GROUP BY op_type, account_name;
        `
        let selectResult = await pool.query(selectSql, [ accountName ]);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getGroupIncome;