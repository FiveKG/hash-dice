// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取用户的资产额度
 * @param { String } accountName
 * @returns { Promise<any> }
 */
async function getUserBalance(accountName) {
    try {
        let selectUserBalanceSql = `
            SELECT
                CAST(
                    withdraw_enable + repeat_currency + lotto_currency + game_currency AS numeric(12, 8)
                ) AS amount, withdraw_enable, repeat_currency, lotto_currency, game_currency 
                FROM balance 
                WHERE account_name = $1;
        `
        let selectResult = await pool.query(selectUserBalanceSql, [ accountName ]);
        return  selectResult.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = getUserBalance;