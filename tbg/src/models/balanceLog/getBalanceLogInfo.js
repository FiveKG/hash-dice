// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取用户的记录
 * @param { String } accountName
 * @param { string } trId
 * @returns { Promise<DB.AccountBalanceLog> }
 */
async function getBalanceLogInfo(accountName, trId) {
    try {
        let selectSql = `
            SELECT create_time, change_amount, remark 
                FROM balance_log 
                WHERE account_name = $1 
                AND extra ->> 'tr_id' = $2
                AND op_type = 'mining'
                ORDER BY create_time DESC
                LIMIT 1;
        `
        const opts = [ accountName, trId ]
        let { rows: [ balanceLogInfo ] } = await pool.query(selectSql, opts);
        return  balanceLogInfo;
    } catch (err) {
        throw err;
    }
}

module.exports = getBalanceLogInfo;