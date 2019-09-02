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
            select account_name,
                cast(
                    withdraw_enable + repeat_currency + lotto_currency + game_currency as numeric(12, 8)
                ) as total, account_name
                from balance
                where total < $1;
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
 * @property { number } total
 */