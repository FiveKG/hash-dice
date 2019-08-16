// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger");

/**
 * 获取用户的记录
 * @param { string } aid 关联账户 id
 * @returns { Promise<{ total: number, op_type: string }[]> }
 */
async function getSystemLogInfo(aid) {
    try {
        let selectSql = `
            SELECT sum(change_amount) AS total, op_type
                FROM system_op_log
                WHERE extra ->> 'aid' = $1
                GROUP BY op_type
        `
        const opts = [ aid ]
        let { rows } = await pool.query(selectSql, opts);
        return  rows;
    } catch (err) {
        logger.error("query system_op_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getSystemLogInfo;