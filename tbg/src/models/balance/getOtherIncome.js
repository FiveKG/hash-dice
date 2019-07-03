// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取用户的分红收入记录
 * @param { String } accountName
 * @param { Number } limit
 * @param { Number } page
 * @returns { Promise<any[]> }
 */
async function getOtherIncome(accountName, limit, page) {
    try {
        let selectSql = `
            SELECT create_time, change_amount, remark, op_type from balance_log 
                WHERE account_name = $1
                AND op_type != 'mode income' 
                AND op_type != 'sort income'
                AND op_type != 'invite income'
                ORDER BY create_time DESC
                LIMIT $2 
                OFFSET $3;
        `
        const opts = [ accountName, limit, (page - 1) * limit ]
        let selectResult = await pool.query(selectSql, opts);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getOtherIncome;