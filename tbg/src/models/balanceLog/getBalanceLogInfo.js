// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger");

/**
 * 
 * @typedef { object } Arg 
 * @property { String } accountName
 * @property { string } [trId]
 * @property { string } [opType]
 */

/**
 * 获取用户的记录
 * @param { Arg } params
 * @returns { Promise<DB.AccountBalanceLog[]> }
 */
async function getBalanceLogInfo(params) {
    try {
        const { accountName, trId, opType } = params;
        const opts = [];
        const values = [];

        if (!!accountName) {
            opts.push(accountName);
            values.push(`account_name = $${ opts.length }`);
        }
        
        if (!!trId) {
            opts.push(trId.split(","));
            values.push(`extra ->> 'tr_id' = any($${ opts.length })`)
        } 

        if (!!opType) {
            opts.push(opType);
            values.push(`op_type = $${ opts.length }`);
        }

        let selectSql = `
            SELECT * FROM balance_log 
                WHERE ${ values.join(" AND ") }
                ORDER BY create_time DESC;
        `

        // logger.debug("selectSql: ", selectSql, opts);
        let { rows: balanceLogInfo } = await pool.query(selectSql, opts);
        return  balanceLogInfo;
    } catch (err) {
        logger.error("query balance_log error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getBalanceLogInfo;