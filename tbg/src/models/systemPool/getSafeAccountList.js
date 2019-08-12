// @ts-check
const { pool } = require("../../db/index.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js")

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
            select account_name, cast($1 - total as numeric(12, 8)) as last, (select sum(total) from etc) as all
                from etc where total < $1;
        `
        let { rows } = await pool.query(sql, [ INCOME_CONSTANT.SAFE_OUT_LINE ]);
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
 * @property { number } last
 * @property { number } all
 */