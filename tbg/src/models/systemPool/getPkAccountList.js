// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 查找符合直接推荐PK奖金分红的帐号
 * @return  { Promise<pkAccountList[]> }
 */
async function getPkAccount() {
    try {
        let sql = `
            SELECT referrer_name, count(referrer_name) AS invite_count 
                FROM referrer 
                WHERE account_name !~ '-' AND referrer_name != '' AND account_name != (SELECT account_name FROM referrer WHERE referrer_name = '')
                GROUP BY referrer_name 
                ORDER BY invite_count DESC
                LIMIT 10;
        `
        let { rows } = await pool.query(sql);
        return rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getPkAccount;

/**
 * @description 查找符合直接推荐PK奖金分红的帐号
 * @typedef { Object } pkAccountList
 * @property { String } referrer_name
 * @property { number } invite_count
 */