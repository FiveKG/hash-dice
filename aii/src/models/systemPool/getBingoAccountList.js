// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 查找符合直接推荐PK奖金分红的帐号
 * @return  { Promise<bingoAccountList[]> }
 */
async function getBingoAccount() {
    try {
        let sql = `
            select account_name 
                from account_op where op_type = 'investment' 
                order by create_time desc 
                limit 30;
        `
        let { rows } = await pool.query(sql);
        return rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getBingoAccount;

/**
 * @description 查找符合直接推荐PK奖金分红的帐号
 * @typedef { Object } bingoAccountList
 * @property { String } account_name
 */