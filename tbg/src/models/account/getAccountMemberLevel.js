// @ts-check
const { pool } = require("../../db");
// const logger = require("../../common/logger.js").child({ "@models/account/getAccountMemberLevel.js": "查询帐号的等级" });

/**
 * 查询帐号的等级 1 -> 未激活 2 -> 黄金 3 -> 钻石
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<any> }
 */
async function getAccountMemberLevel(accountName) {
    try {
        let selectAccountLevelSql = `
            select refer_count, member_level, refer_code from account where account_name = $1;
        `
        let { rows } = await pool.query(selectAccountLevelSql, [accountName]);
        return rows[0];
    } catch (err) {
        throw err
    }
}

module.exports = getAccountMemberLevel;