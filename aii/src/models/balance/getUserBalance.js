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
            select 
                cast(
                    withdraw_enable + repeat_currency + lotto_currency + game_currency as numeric(12, 8)
                ) as amount, withdraw_enable, repeat_currency, lotto_currency, game_currency 
                from balance where account_name = '${ accountName }';
        `
        let selectResult = await pool.query(selectUserBalanceSql);
        return  selectResult.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = getUserBalance;