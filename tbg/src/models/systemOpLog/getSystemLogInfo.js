// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger");

/**
 * 获取用户的记录
 * @param { { aid?: string, symbol?: string } } data
 * @returns { Promise<{ total: number, op_type: string }[]> }
 */
async function getSystemLogInfo(data) {
    try {
        const opts = [];
        let whereStr = []
        if (!!data.aid) {
            opts.push(data.aid);
            whereStr.push(`extra ->> 'aid' = $${ opts.length }`);
        }

        if (!!data.symbol) {
            opts.push(data.symbol);
            whereStr.push(`extra ->> 'symbol' = $${ opts.length }`);
        }
        let selectSql = `
            SELECT sum(change_amount) AS total, op_type
                FROM system_op_log
                WHERE ${ whereStr.join(" AND ") }
                GROUP BY op_type
        `
        let { rows } = await pool.query(selectSql, opts);
        return  rows;
    } catch (err) {
        logger.error("query system_op_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getSystemLogInfo;