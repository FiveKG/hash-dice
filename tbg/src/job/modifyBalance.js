// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "修改用户的额度" });
const { Decimal } = require("decimal.js");
const { MAX_RISE_PRICE, MIN_RISE_PRICE, OPENING_PRICE_KEY } = require("../common/constant/tradeConstant");
const { getUserBalance } = require("../models/balance");
const { getAccountInfo } = require("../models/account");
const { redis } = require("../common");
const { pool } = require("../db");

/**
 * 修改用户的额度
 * @param {{ game_type: string, account_name: string, change_amount: number, pay_type: string }} data
 */
async function modifyBalance(data) {
    try {
        const accountInfo = await getAccountInfo(data.account_name);
        if (!accountInfo) {
            return;
        }
        const sqlList = [];
        const insertBalanceLogSql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra, remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        let updateAmountSql = `
            UPDATE balance 
            SET withdraw_enable = withdraw_enable + $1, 
                repeat_currency = repeat_currency + $2,  
                lotto_currency = lotto_currency + $3, 
                game_currency = game_currency + $4 
            WHERE account_name = $5
        `
        const accountName = data.account_name;
        const changeAmount = new Decimal(data.change_amount);
        let rows = await getUserBalance(accountName);
        const currentBalance = changeAmount.add(rows.amount);
        let lottoCurrency = new Decimal(0);
        let gameCurrency = new Decimal(0);
        let withdrawEnable = new Decimal(0);
        if (data.pay_type === "lotto_currency") {
            lottoCurrency = new Decimal(data.change_amount);
        } if (data.pay_type === "game_currency") {
            gameCurrency = new Decimal(data.change_amount);
        } else {
            withdrawEnable = new Decimal(data.change_amount);
        }
        sqlList.push({ sql: updateAmountSql, values: [ withdrawEnable.toNumber(), 0, lottoCurrency.toNumber(), gameCurrency.toNumber(), accountName ] });
        let remark = ``;
        if (changeAmount.lessThan(0)) {
            remark = `user ${ accountName } play ${ data.game_type } game, deduct ${ data.pay_type } balance ${ changeAmount }`;
        } else {
            remark = `user ${ accountName } play ${ data.game_type } game, return ${ data.pay_type } balance ${ changeAmount }`;
        }

        sqlList.push({ 
            sql: insertBalanceLogSql, 
            values: [ 
                accountName, changeAmount.toNumber(), currentBalance.toNumber(), 
                `play ${ data.game_type } game`, {}, remark, "now()"
            ] 
        });
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

    } catch (err) {
        logger.error("修改用户的额度 error, the error stock is %O", err);
        throw err;
    }
}

module.exports = modifyBalance