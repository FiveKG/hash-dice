// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 查找符合直接推荐PK奖金分红的帐号
 * @return  { Promise<pkAccountList[]> }
 */
async function getPkAccount() {
    try {
        let sql = `
            select referrer_name, count(referrer_name) as invite_count 
                from referrer 
                where account_name !~ '-' and referrer_name != '' 
                group by referrer_name 
                order by invite_count desc limit 10;
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