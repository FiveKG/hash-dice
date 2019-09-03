// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger");

/**
 * 
 * @typedef { object } Arg 
 * @property { string } [opType]
 * @property { string } [symbol]
 */

/**
 * 获取用户的记录
 * @param { Arg } params
 * @returns { Promise<number> }
 */
async function getBalanceLogByTerm(params) {
    try {
        const { opType, symbol } = params;
        const opts = [];
        const values = [];

        if (!!symbol) {
            opts.push(symbol);
            values.push(`extra ->> 'symbol' = $${ opts.length }`)
        } 

        if (!!opType) {
            opts.push(opType);
            values.push(`op_type = $${ opts.length }`);
        }

        const selectSql = `
            SELECT sum(change_amount) AS total FROM balance_log 
                WHERE ${ values.join(" AND ") }
        `

        const { rows: [ { total } ] } = await pool.query(selectSql, opts);
        return  !!total ? total : 0;
    } catch (err) {
        logger.error("query balance_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getBalanceLogByTerm;