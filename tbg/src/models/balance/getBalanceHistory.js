// @ts-check
const { pool } = require("../../db/index.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");

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
                AND op_type = $2
                ORDER BY create_time DESC;
        `
        let selectResult = await pool.query(selectSql, [ accountName, OPT_CONSTANTS.WITHDRAW ]);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getBalanceHistory;