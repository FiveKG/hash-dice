// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");
const { ACCOUNT_INACTIVATED } = require("../../common/constant/accountConstant");

/**
 * 会员等级 直接推荐会员数
 * 海蓝会员 0 -5 个会员
 * 紫晶会员 6 - 15 个会员
 * 黄金会员 16 - 30 个会员
 * 红钻会员 31 - 50 个会员
 * 皇冠会员 51 个会员以上
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<{"count": number, "state": number}> }
 */
async function getAccountMemberLevel(accountName) {
    try {
        let selectAccountLevelSql = `
            SELECT (SELECT count(1)::INTEGER as count FROM referrer r
                        JOIN account a ON r.account_name = a.account_name
                        WHERE referrer_name = $1
                        AND a.state != ${ ACCOUNT_INACTIVATED }
                    ) AS count, state
                FROM account
                WHERE account_name = $1
        `
        let { rows: [ memberInfo ] } = await pool.query(selectAccountLevelSql, [ accountName ]);
        return memberInfo;
    } catch (err) {
        logger.error("get account member level error, the error stock is %O", err);
        throw err
    }
}

module.exports = getAccountMemberLevel;