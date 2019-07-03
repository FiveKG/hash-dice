// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取用户的提现历史
 * @param { String } accountName
 * @returns { Promise<any> }
 */
async function getBalanceHistory(accountName) {
    try {
        let selectSql = `
            SELECT change_amount, create_time 
                FROM balance_log 
                WHERE account_name = $1 
                AND op_type = 'withdraw' 
                ORDER BY create_time DESC;
        `
        let selectResult = await pool.query(selectSql, [ accountName ]);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getBalanceHistory;