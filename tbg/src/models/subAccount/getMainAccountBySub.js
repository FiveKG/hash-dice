// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js");

/**
 * 根据子帐号查询用户的子账号
 * @param { String[] } subAccount 用户 EOS 帐号
 * @returns { Promise<DB.SubAccount[]> }
 */
async function getMainAccountBySub(subAccount) {
    try {
        let sql = `
            SELECT * FROM sub_account WHERE sub_account_name = any($1);
        `
        let { rows: subAccountInfo } = await pool.query(sql, [ subAccount ]);
        return subAccountInfo;
    } catch (err) {
        logger.error("query main account error, the error stock is %O", err);
        throw err
    }
}

module.exports = getMainAccountBySub;