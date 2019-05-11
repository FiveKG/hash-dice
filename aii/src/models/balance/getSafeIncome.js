// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取用户的分红收入记录
 * @param { String } accountName
 * @param { Number } limit
 * @param { Number } page
 * @returns { Promise<any> }
 */
async function getSafeIncome(accountName, limit, page) {
    try {
        let selectSql = `
            select create_time, change_amount, remark from balance_log 
                where account_name = '${ accountName }' and op_type = 'safe income'
                order by create_time desc 
                limit ${ limit } offset ${ (page - 1) * limit };
        `
        let selectResult = await pool.query(selectSql);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getSafeIncome;