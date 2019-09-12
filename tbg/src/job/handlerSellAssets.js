// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/handlerSellAssets.js": "卖出资产" });
const { Decimal } = require("decimal.js");
const { getAllTrade } = require("../models/trade");
const { format } = require("date-fns");
const sellAlloc = require("./sellAlloc");
const buyAlloc = require("./buyAlloc");

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
        const { account_name: accountName, price, amount, sell_fee, destroy, create_time, trId, income } = data;
        // 卖出额度
        let sellAmount = new Decimal(amount);
        logger.debug("sellAmount: ", sellAmount);
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
        if (tradeLogList.length !== 0) {
            // 遍历所有的买单
            let total = new Decimal(0);
            for (const info of tradeLogList) {
                // 如果当前用户卖出的数量大于当前的买单成交数量，继续卖给下一个
                total = total.add(info.amount);
                // 待成交数量
                const trxAmount = new Decimal(info.amount).minus(info.trx_amount);
                if (!sellAmount.lessThan(trxAmount)) {
                    // 剩余
                    sellAmount = sellAmount.minus(trxAmount);
                    logger.debug("!lessThan: ", trxAmount, sellAmount);
                    const data = { 
                        ...info, 
                        tradeOpType: "finished", 
                        trxAmount: trxAmount.toNumber() 
                    }
                    const { queryList, actionsList } = await buyAlloc(data);
                    trxList.push(...queryList);
                    tmpActions.push(...actionsList);
                } else {
                    logger.debug("lessThan: ", trxAmount, sellAmount);
                    const data = { 
                        ...info, 
                        tradeOpType: "wait", 
                        trxAmount: sellAmount.toNumber() 
                    }
                    // 剩余 80 - 100
                    sellAmount = sellAmount.minus(trxAmount);
                    const { queryList, actionsList } = await buyAlloc(data);
                    trxList.push(...queryList);
                    tmpActions.push(...actionsList);
                }

                // 分配完订单的额度，跳出循环
                if (!total.lessThan(amount)) {
                    break;
                }
            }

            let opType = "finished"
            let trxAmount = new Decimal(amount);
            // 如果全部成交, 否则只更新成交的额度
            if (!sellAmount.lessThanOrEqualTo(0)) {
                opType = "wait";
                trxAmount = trxAmount.minus(sellAmount);
            }

            const { queryList, actionsList } = await sellAlloc({ ...tradeInfo, tradeOpType: opType, trxAmount: trxAmount });
            trxList.push(...queryList);
            tmpActions.push(...actionsList);
        }

        // logger.debug("trxList: ", trxList);
        let flag = false;
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
            flag = true;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        // 一笔交易完成，才对用户执行空投及相关的转账操作
        if (tmpActions.length !== 0 && flag) {
            await psTrx.pub(tmpActions);
        }
    } catch (err) {
        logger.error("raise airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = handlerSellAssets