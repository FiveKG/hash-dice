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
            select change_amount, create_time 
                from balance_log 
                where account_name = '${ accountName }' and op_type = 'withdraw' 
                order by create_time desc;
        `
        let selectResult = await pool.query(selectSql);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getBalanceHistory;