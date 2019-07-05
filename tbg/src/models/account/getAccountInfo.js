// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<DB.Account> }
 */
async function getAccountInfo(accountName) {
    try {
        let selectAccountLevelSql = `
            select * from account where account_name = $1;
        `
        let { rows: [ accountInfo ] } = await pool.query(selectAccountLevelSql, [ accountName ]);
        return accountInfo;
    } catch (err) {
        logger.error("get account information error, the error stock is %O", err);
        throw err
    }
}

module.exports = getAccountInfo;