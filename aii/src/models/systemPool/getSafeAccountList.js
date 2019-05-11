// @ts-check
const { pool } = require("../../db/index.js");


/**
 * 查找收益小于 150 的一行公排对应的主帐号
 * @return  { Promise<safeAccountList[]> }
 */
async function getSafeAccount() {
    try {
        let sql = `
            with etc as (
                select account_name,
                    cast(
                        withdraw_enable + repeat_currency + lotto_currency + game_currency as numeric(12, 8)
                    ) as total
                    from balance
            )
            select account_name, cast(150 - total as numeric(12, 8)) as last, 
                (select sum(total) from etc) as all
                from etc where total < 150;
        `
        let { rows } = await pool.query(sql);
        return rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getSafeAccount;

/**
 * @description 查找收益小于 150 的一行公排对应的主帐号
 * @typedef { Object } safeAccountList
 * @property { String } account_name
 * @property { Number } last
 * @property { Number } all
 */