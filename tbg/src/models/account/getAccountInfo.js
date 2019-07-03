// @ts-check
const { pool } = require("../../db");

/**
 * 会员等级 直接推荐会员数
 * 海蓝会员 0 -5 个会员
 * 紫晶会员 6 - 15 个会员
 * 黄金会员 16 - 30 个会员
 * 红钻会员 31 - 50 个会员
 * 皇冠会员 51 个会员以上
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
        console.error("get account information error, the error stock is %O", err);
        throw err
    }
}

module.exports = getAccountInfo;