// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 查找符合股东分红条件的帐号
 * @return  { Promise<holderAccountList[]> }
 */
async function getHolderAccount() {
    try {
        let sql = `
            with share as (
                with etc as (
                    select r.referrer_name, r.account_name from referrer r 
                        join (
                            select account_name from account where member_level = 3
                        ) a on a.account_name = r.referrer_name 
                        where length(r.account_name) = 12
                )
                select e.referrer_name, e.account_name, count(sub_account_name) 
                from etc e join sub_account s on s.main_account = e.account_name 
                group by e.account_name, e.referrer_name
            )
            select referrer_name, sum(count) as total, (select sum(count) from share) as all
                from share 
                group by referrer_name;
        `
        let { rows } = await pool.query(sql);
        return rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getHolderAccount;

/**
 * @description 查找符合股东分红条件的帐号
 * @typedef { Object } holderAccountList
 * @property { String } referrer_name
 * @property { number } total
 * @property { number } all
 */