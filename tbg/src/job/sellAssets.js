// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/sellAssets.js": "卖出资产" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const { getUserReferrer } = require("../models/referrer");
const { getBalanceLogInfo } = require("../models/balanceLog");
const { TSH_INCOME, TBG_MINE_POOL, TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { getAssetsInfoById } = require("../models/asset");
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { insertBalanceLog } = require("../models/balance");
const { updateTbgBalance, getTbgBalanceInfo } = require("../models/tbgBalance");
const TRADE_CONSTANTS = require("../common/constant/tradeConstant.js");
const { generate_primary_key } = require("../common/index.js");
const { insertTradeLog, updateTrade, getTradeLog, getAllTrade } = require("../models/trade");
const { format } = require("date-fns");


/**
 * 卖出资产
 * @param {{ "account_name": string, "price": number, 
 *          "amount": number, "sell_fee": number, "destroy": number, 
 *          "income": number, "create_time": string, trId: string }} data
 */
async function sellAssets(data) {
    try {
        const trxList = [];
        let tmpActions = []
        let insertBalanceLogSql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra，remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        const updateBalanceSql = `
            UPDATE tbg_balance 
                SET release_amount = release_amount + $1, 
                    sell_amount = sell_amount + $2,  
                    active_amount = active_amount + $3
                WHERE account_name = $4
        `
        const updateTradeSql = `
            UPDATE trade SET state = $1, finished_time = $2, trx_amount = $3 WHERE id = $4
        `
        const insertTradeLogSql = `
            INSERT INTO trade_log(id, tr_id, account_name, trade_type, amount, memo, price, state, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `
        const now = new Date();
        const { account_name: accountName, price, amount, sell_fee, destroy, create_time, trId } = data;
        // 获取所有等待交易的买单，根据用户卖出的额度
        const tradeLogList = await getAllTrade("buy", "create");

        // 遍历所有的买单
        let total = 0;
        for (const info of tradeLogList) {
            // 如果当前用户卖出的数量大于当前的买单数量，继续给下个卖给下一个
            total += info.amount;
            const finishTime = format(now, "YYYY-MM-DD : HH:mm:ssZ");
            if (info.amount < amount) {
                const memo = `user ${ amount } sell, trade finished`
                trxList.push({
                    sql: insertTradeLogSql,
                    values: [ generate_primary_key(), info.id, accountName, "buy", amount, memo, amount * price, "finished", finishTime]
                })

                trxList.push({
                    sql: updateTradeSql,
                    values: [ "finished", finishTime, amount, info.id ]
                })
            } else {
                const memo = `user ${ amount } sell, trade waiting`
                trxList.push({
                    sql: insertTradeLogSql,
                    values: [ generate_primary_key(), info.id, accountName, "buy", amount, memo, amount * price, "create", finishTime]
                })

                trxList.push({
                    sql: updateTradeSql,
                    values: [ "create", finishTime, amount, info.id ]
                })
            }

            // 分配完用户卖出的额度，跳出循环
            if (total >= amount) {
                break;
            }
        }
        

        // 卖出后，减去用户的可售余额和可售额度
        const tbgBalance = await getTbgBalanceInfo(accountName);
        const remark1 = '';
        const remark2 = '';
        trxList.push({
            sql: insertBalanceLogSql,
            values: [ accountName, -amount, tbgBalance.sell_amount - amount, OPT_CONSTANTS.FIRST_BUY, { "symbol": TBG_TOKEN_SYMBOL }, remark1, now ]
        })
        trxList.push({
            sql: insertBalanceLogSql,
            values: [ accountName, -amount, tbgBalance.sell_amount - amount, OPT_CONSTANTS.FIRST_BUY, { "symbol": TBG_TOKEN_SYMBOL }, remark2, now ]
        })
        trxList.push({
            sql: updateBalanceSql,
            values: [ 0, -amount, -amount, accountName ]
        })
        const finishTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
        const memo = '';
        // 修改卖出订单的状态
        trxList.push({
            sql: insertTradeLogSql,
            values: [ generate_primary_key(), trId, accountName, "sell", amount, memo, amount * price, "finished", finishTime]
        })

        trxList.push({
            sql: updateTradeSql,
            values: [ "finished", finishTime, amount, trId ]
        })
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
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
        logger.error("raise airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = sellAssets