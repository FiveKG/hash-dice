// @ts-check
const { pool } = require("../../db/index.js");
const { PK, HOLDER, PROTECTION, GAME_INVITE, BINGO } = require("../../common/constant/optConstants.js");

/**
 * 获取用户的分红收入记录
 * @param { String } accountName
 * @param { number } limit
 * @param { number } page
 * @returns { Promise<any[]> }
 */
async function getOtherIncome(accountName, limit, page) {
    try {
        let selectSql = `
            SELECT create_time, change_amount, remark, op_type 
                FROM balance_log 
                WHERE account_name = $1
                AND op_type = any($2)
                AND extra->>'symbol' = 'UE'
                ORDER BY create_time DESC
        `
        const opts = [ accountName, [ PK, HOLDER, PROTECTION, GAME_INVITE, BINGO ] ]
        let selectResult = await pool.query(selectSql, opts);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getOtherIncome;