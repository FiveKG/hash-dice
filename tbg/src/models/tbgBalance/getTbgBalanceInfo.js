// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger");

/**
 * 获取用户的记录
 * @param { string } accountName 关联账户 id
 * @returns { Promise<DB.TbgBalance> }
 */
async function getTbgBalanceInfo(accountName) {
    try {
        let selectSql = `
            SELECT * FROM tbg_balance WHERE account_name = $1
        `
        const opts = [ accountName ]
        let { rows: [ tbgBalanceInfo ] } = await pool.query(selectSql, opts);
        return  tbgBalanceInfo;
    } catch (err) {
        logger.error("query tbg_balance error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getTbgBalanceInfo;