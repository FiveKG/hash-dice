// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger");

/**
 * 获取每层推荐的用户子账号数
 * @param { String } accountName
 * @returns { Promise<any> }
 */
async function getInviteAccountCount(accountName) {
    try {
        let currentMaxLevel = `
            SELECT s.main_account, s.level, s.position 
                FROM referrer r 
                JOIN sub_account s ON s.main_account = r.account_name 
                WHERE r.referrer_name = $1;
        `
        let { rows } = await pool.query(currentMaxLevel, [ accountName ]);
        return rows;
    } catch (err) {
        logger.error("get sub_account max level error, the error stock is %O", err);
        throw err
    }
}

module.exports = getInviteAccountCount;