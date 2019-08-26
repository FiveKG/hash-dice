// @ts-check
const { pool } = require("../../db");

/**
 * 获取投资用户的推荐人
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<any> }
 */
async function getUserReferrer(accountName) {
    try {
        let selectSql = `
            select a.refer_code, a.account_name from account a 
                join referrer r on r.referrer_name  = a.account_name 
                where r.account_name = $1;
        `
        let { rows: [ referrerInfo ] } = await pool.query(selectSql, [ accountName ]);
        return !!referrerInfo ? referrerInfo.account_name : referrerInfo;
    } catch (err) {
        throw err
    }
}

module.exports = getUserReferrer;