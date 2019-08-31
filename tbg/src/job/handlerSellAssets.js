// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/handlerSellAssets.js": "卖出资产" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const { TBG_TOKEN_SYMBOL, WALLET_RECEIVER, UE_TOKEN, UE_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { getTbgBalanceInfo } = require("../models/tbgBalance");
const { generate_primary_key } = require("../common/index.js");
const { getAllTrade } = require("../models/trade");
const { format } = require("date-fns");
const buyAirdrop = require("./buyAirdrop.js");

/**
 * 卖出资产
 * 用户卖出 TBG，可以得到 UE
 * 监听用户 TBG 转账，如果有，将相应的 UE 转回用户的账户中 
 * @param {{ "account_name": string, "price": number, 
 *          "amount": number, "sell_fee": number, "destroy": number, 
 *          "income": number, "create_time": string, trId: string }} data
 */
async function handlerSellAssets(data) {
    try {
        const trxList = [];
        let tmpActions = []
        let insertBalanceLogSql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra, remark, create_time)
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
            INSERT INTO trade_log(id, tr_id, trade_type, amount, memo, price, volume, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8);
        `
        const now = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
        const { account_name: accountName, price, amount, sell_fee, destroy, create_time, trId, income } = data;
        const queryTradeSql = `SELECT * FROM trade WHERE id = $1 AND state = 'wait'`;
        // 根据监听到的信息去查找订单
        const { rows: [ tradeInfo ] } = await pool.query(queryTradeSql, [ trId ]);
        // 如果找不到这个卖单直接返回，不做处理
        if (!tradeInfo) {
            return
        }
        
        // 获取所有等待交易的买单，根据用户卖出的额度
        const tradeLogList = await getAllTrade("buy", "wait");
        // 如果找不到买单, 修改订单的状态为等待卖出
        if (tradeLogList.length === 0) {
            // const finishTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
            // const memo = `not user buy asset，trade waiting`;
            // // 修改卖出订单的状态
            // trxList.push({
            //     sql: insertTradeLogSql,
            //     values: [ generate_primary_key(), trId, accountName, "sell", amount, memo, amount * price, finishTime]
            // })

            // trxList.push({
            //     sql: updateTradeSql,
            //     values: [ "wait", finishTime, 0, trId ]
            // });
        } else {
            // 遍历所有的买单
            let total = 0;
            for (const info of tradeLogList) {
                // 如果当前用户卖出的数量大于当前的买单数量，继续卖给下一个
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
                    });

                    const { queryList, actionsList } = await buyAirdrop(info);
                    trxList.push(...queryList);
                    tmpActions.push(...actionsList);
                } else {
                    const memo = `user ${ amount } sell, trade waiting`
                    trxList.push({
                        sql: insertTradeLogSql,
                        values: [ generate_primary_key(), info.id, accountName, "buy", amount, memo, amount * price, "wait", finishTime]
                    })

                    trxList.push({
                        sql: updateTradeSql,
                        values: [ "wait", finishTime, amount, info.id ]
                    })
                }

                // 分配完用户卖出的额度，跳出循环
                if (total >= amount) {
                    break;
                }
            }

            // 卖出后，减去用户的可售余额和可售额度
            const tbgBalance = await getTbgBalanceInfo(accountName);
            const remark1 = `user sell ${ amount } assets, minus ${ amount } sell_amount`;
            const remark2 = `user sell ${ amount } assets, minus ${ amount } active_amount`;
            trxList.push({
                sql: insertBalanceLogSql,
                values: [ accountName, -amount, tbgBalance.sell_amount - amount, OPT_CONSTANTS.SELL, { "symbol": TBG_TOKEN_SYMBOL, "op_type": 'sell_amount' }, remark1, now ]
            })
            trxList.push({
                sql: insertBalanceLogSql,
                values: [ accountName, -amount, tbgBalance.active_amount - amount, OPT_CONSTANTS.SELL, { "symbol": TBG_TOKEN_SYMBOL, "op_type": 'active_amount' }, remark2, now ]
            })
            trxList.push({
                sql: updateBalanceSql,
                values: [ 0, -amount, -amount, accountName ]
            })
            const finishTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
            const memo = `user sell ${ amount } assets, get income ${ amount * price }`;
            // 修改卖出订单的状态
            trxList.push({
                sql: insertTradeLogSql,
                values: [ generate_primary_key(), trId, accountName, "sell", amount, memo, amount * price, "finished", finishTime]
            })

            trxList.push({
                sql: updateTradeSql,
                values: [ "finished", finishTime, amount, trId ]
            });

            const destroyAmount =  new Decimal(destroy);
            const incomeAmount = new Decimal(income);
            // 手续费
            const fee = new Decimal(sell_fee);
            // 卖出需要销毁一部分额度
            // 监听转账时，用户一次将所有的 TBG 代币都转到了 TBG_FREE_POOL，所以需要从 TBG_FREE_POOL 再转回发币账户，只能用发币账户销毁
            tmpActions.push(
                {
                    account: UE_TOKEN,
                    name: "transfer",
                    authorization: [{
                        actor: WALLET_RECEIVER,
                        permission: 'active',
                    }],
                    data: {
                        from: WALLET_RECEIVER,
                        to: accountName,
                        quantity: `${ incomeAmount.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                        memo: `user ${ accountName } sell ${ amount } TBG, get ${ income } UE`,
                    }
                },
                {
                    account: TBG_TOKEN_COIN,
                    name: "transfer",
                    authorization: [{
                        actor: TBG_TOKEN_COIN,
                        permission: 'active',
                    }],
                    data: {
                        from: TBG_FREE_POOL,
                        to: TBG_TOKEN_COIN,
                        quantity: `${ destroyAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: `user ${ accountName } sell ${ amount } TBG, destroy to ${ TBG_TOKEN_COIN } destroy`,
                    }
                },
                {
                    account: TBG_TOKEN_COIN,
                    name: "retire",
                    authorization: [{
                        actor: TBG_TOKEN_COIN,
                        permission: 'active',
                    }],
                    data: {
                        quantity: `${ destroyAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, destroy ${ destroyAmount.toFixed(4) }`,
                    }
                }
            )
        }

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

        // 一笔交易完成，才对用户执行空投及相关的转账操作
        await psTrx.pub(tmpActions);
    } catch (err) {
        logger.error("raise airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = handlerSellAssets