// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/handlerBuyAssets.js": "处理买入交易" });
const { Decimal } = require("decimal.js");
const { getAllTrade } = require("../models/trade");
const buyAlloc = require("./buyAlloc");
const sellAlloc = require("./sellAlloc");

handlerBuyAssets({account_name: "yujinsheng11", price: 1, amount: 100, trId: "ef4099f0f480933f"});

/**
 * 卖出资产
 * 用户卖出 TBG，可以得到 UE
 * 监听用户 TBG 转账，如果有，将相应的 UE 转回用户的账户中 
 * @param {{ "account_name": string, "price": number, 
 *          "amount": number, trId: string }} data
 */
async function handlerBuyAssets(data) {
    try {
        const trxList = [];
        let tmpActions = []
        const { account_name: accountName, price, amount, trId } = data;
        // 买入额度
        let buyAmount = new Decimal(amount);
        logger.debug("buyAmount: ", buyAmount);
        const queryTradeSql = `SELECT * FROM trade WHERE id = $1 AND state = 'wait'`;
        // 根据监听到的信息去查找订单
        const { rows: [ tradeInfo ] } = await pool.query(queryTradeSql, [ trId ]);
        // 如果找不到这个卖单直接返回，不做处理
        if (!tradeInfo) {
            return
        }
        
        // 获取所有等待交易的买单
        const tradeLogList = await getAllTrade("sell", "wait");
        logger.debug("tradeLogList: ", tradeLogList);
        // 如果找不到买单, 修改订单的状态为等待卖出
        if (tradeLogList.length != 0) {
            // 遍历所有的卖单
            let total = new Decimal(0);
            for (const info of tradeLogList) {
                // 按卖单顺序成交
                total = total.add(info.amount);
                // 待成交数量
                const trxAmount = new Decimal(info.amount).minus(info.trx_amount);
                if (!buyAmount.lessThan(trxAmount)) {
                    // 剩余
                    buyAmount = buyAmount.minus(trxAmount);
                    logger.debug("!lessThan: ", buyAmount, trxAmount);
                    const data = { 
                        ...info, 
                        tradeOpType: "finished", 
                        trxAmount: trxAmount.toNumber()
                    }
                    const { queryList, actionsList } = await sellAlloc(data);
                    trxList.push(...queryList);
                    tmpActions.push(...actionsList);
                } else {
                    logger.debug("lessThan: ", buyAmount, trxAmount);
                    const data = { 
                        ...info, 
                        tradeOpType: "wait", 
                        trxAmount: buyAmount.toNumber()
                    }
                    // 剩余
                    buyAmount = buyAmount.minus(trxAmount);
                    const { queryList, actionsList } = await sellAlloc(data);
                    trxList.push(...queryList);
                    tmpActions.push(...actionsList);
                }

                // 全部成交，跳出循环
                if (!total.lessThan(amount)) {
                    break;
                }
            }

            
            // 如果全部成交, 否则只更新成交的额度
            let trxAmount = new Decimal(amount);
            let tradeOpType = "finished";
            if (!buyAmount.lessThanOrEqualTo(0)) {
                tradeOpType = "wait";
                trxAmount = trxAmount.minus(buyAmount);
            }

            const { queryList, actionsList } = await buyAlloc({ ...tradeInfo, tradeOpType: tradeOpType, trxAmount: trxAmount });
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
            flag = true
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
        logger.error("buy assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = handlerBuyAssets