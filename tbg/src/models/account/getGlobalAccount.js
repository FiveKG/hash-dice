// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * 查找全球合伙人
 * @param { string } accountType 用户 EOS 帐号
 * @param { string[] } accountList 用户 EOS 帐号
 * @returns { Promise<DB.Account> }
 */
async function getGlobalAccount(accountType, accountList) {
    try {
        let selectAccountLevelSql = `
            SELECT * FROM account WHERE account_type = $1 AND account_name = any($2) ORDER BY create_time DESC LIMIT 1;
        `
        let { rows: [ accountInfo ] } = await pool.query(selectAccountLevelSql, [ accountType, accountList ]);
        return accountInfo;
    } catch (err) {
        logger.error("get account information error, the error stock is %O", err);
        throw err
    }
}

module.exports = getGlobalAccount;