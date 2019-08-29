// @ts-check
const { pool } = require("../../db/index.js");
const { INVITE } = require("../../common/constant/optConstants");

/**
 * 查找符合直接推荐PK奖金分红的帐号
 * @return  { Promise<bingoAccountList[]> }
 */
async function getBingoAccount() {
    try {
        let sql = `
            with tmp as (
                select * from account_op 
                where op_type = '${ INVITE }' 
                order by create_time desc
            )
            select distinct account_name from tmp limit 30;
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