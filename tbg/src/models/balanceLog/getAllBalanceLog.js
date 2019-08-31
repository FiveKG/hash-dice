// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger");

/**
 * 获取用户的记录
 * @param { string } symbol
 * @returns { Promise<{ total: number, op_type: string }[]> }
 */
async function getAllBalanceLog(symbol) {
    try {
        const selectSql = `
            SELECT sum(change_amount) AS total, op_type 
                FROM balance_log 
                WHERE extra ->> 'symbol' = $1
                GROUP BY op_type
        `

        const { rows } = await pool.query(selectSql, [ symbol ]);
        return  rows;
    } catch (err) {
        logger.error("query balance_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getAllBalanceLog;