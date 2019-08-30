// @ts-check
const logger = require("../common/logger.js").child({ "@": "listening user sell asset package" });
const { getTrxAction } = require("./getTrxAction.js");
const { redis, generate_primary_key } = require("../common");
const { UE_TOKEN, WALLET_RECEIVER, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { RAISE, BUY, FIRST_BUY, SELL } = require("../common/constant/optConstants");
const { TBG_FREE_POOL, TBG_TOKEN_COIN } = require("../common/constant/accountConstant.js");
const { OPENING_PRICE_KEY, DESTROY, SELL_FEE, BASE_RATE } = require("../common/constant/tradeConstant.js");
const SELL_ASSETS_KEY = "tbg:sell_assets:account_action_seq";
const { scheduleJob } = require("node-schedule");
const { pool, psSellAssets } = require("../db/index.js");
const { Decimal } = require("decimal.js");
const { insertTradeLog, updateTrade, getTradeInfo } = require("../models/trade");
const { format } = require("date-fns");

logger.debug(`beginListenAction running...`);
scheduleJob("*/1 * * * * *", begin);
const SELL_LOCK = `tbg:lock:sell`;
let count  = 1;
async function begin() {
    try {
        const investLock = await redis.get(SELL_LOCK);
        if (!investLock) {
            await handlerTransferActions();
        } else {
            if (count > 10)  {
                await redis.del(SELL_LOCK);
                count = 0;
            } else {
                count += 1;
            }
            return;
        }
    } catch (err) {
        throw err;
    }
}

async function handlerTransferActions() {
    try {
        await redis.set(SELL_LOCK, 1);
        const actionSeq = await getLastPos();
        const actions = await getTrxAction(UE_TOKEN, actionSeq);
        logger.debug("actionSeq: ", actionSeq);
        for (const action of actions) {
            logger.debug(action);
            const result = await parseEosAccountAction(action);
            const trxSeq = await redis.get(`tbg:sell:trx:${ result.account_action_seq }`);
            logger.debug("result: ", result, "trxSeq: ", !!trxSeq, !result.trx_type);
            // 如果处理过或者返回条件不符，直接更新状态，继续处理下一个
            if (!!trxSeq || !result.trx_type) {
                await setLastPos(result.account_action_seq);
                await redis.set(SELL_ASSETS_KEY, result.account_action_seq);
                continue;
            }

            // 监听到用户购买资产包后，执行相应的逻辑
            if (result.trx_type === SELL) {
                const { from: accountName, price, trade_amount } = result;
                const tradeInfo = await getTradeInfo(accountName, SELL);
                // 没有交易记录，不做处理
                if (tradeInfo.length === 0) {
                    return;
                }

                // 总价除去价格得到交易数量
                const tradeAmount = new Decimal(trade_amount);
                // 拿出排在前面的订单
                const trxInfo = tradeInfo.filter(it => it.state === "create" && tradeAmount.eq(it.amount)).shift();
                if (!trxInfo) {
                    return;
                }
                const client = await pool.connect();
                await client.query("BEGIN");
                try {
                    const finishTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
                    const trLogId = generate_primary_key();
                    const remark = `user ${ accountName } at sell ${ tradeAmount.toNumber() } asset, trade waiting`;
                    // 更新交易状态
                    await updateTrade(client, trxInfo.id, "wait", finishTime);
                    await insertTradeLog(client, trLogId, trxInfo.id, trxInfo.trade_type, trxInfo.amount, remark, trxInfo.price, tradeAmount.mul(price).toNumber(), finishTime);
                    await client.query("COMMIT");
                    // 发送卖出的消息
                    const sellFee = tradeAmount.mul( SELL_FEE);
                    const destroyAmount = tradeAmount.mul(DESTROY);
                    const sellData = {
                        "account_name": accountName,
                        "price":  price,
                        "trId": trxInfo.id,
                        "amount": trxInfo.amount,
                        "sell_fee": sellFee.toFixed(4),
                        "destroy": destroyAmount.toFixed(4),
                        "income": tradeAmount.minus(sellFee).minus(destroyAmount).toFixed(4),
                        "create_time": finishTime
                    }
                    await psSellAssets.pub(sellData);
                } catch (err) {
                    await client.query("ROLLBACK");
                    throw err;
                } finally {
                    await client.release();
                }
            }
            await redis.set(`tbg:sell:trx:${ result.account_action_seq }`, result.trx_id);
            await setLastPos(result.account_action_seq);
        }
        await redis.del(SELL_LOCK);
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param { any } action 
 */
async function parseEosAccountAction(action) {
    try {
        let result = {
            "global_action_seq": action.global_action_seq,
            "account_action_seq" : action.account_action_seq,
            "block_num": action.block_num,
            "block_time": action.block_time,
            "trx_id": "",
            "amount": "",
            "from": "",
            "symbol": "",
            "price": "",
            "trade_amount": "",
            "trx_type": ""
        }
        let actionTrace = action.action_trace;
        if (!actionTrace) {
            // todo
            logger.debug("actionTrace is null");
            return result;
        }
        if (!actionTrace.receipt) {
            // todo
            logger.debug("actionTrace.receipt is null");
            return result;
        }
        if (!actionTrace.act) {
            // todo
            logger.debug("actionTrace.act is null");
            return result;
        }
        if (!actionTrace.trx_id) {
            // todo
            logger.debug("actionTrace.trx_id is null");
            return result;
        }
        result["trx_id"] = actionTrace.trx_id;
        logger.debug(`trx_id: ${ actionTrace.trx_id } -- account_action_seq: ${ action.account_action_seq }`);
        let { receipt, act } = actionTrace;
        // logger.debug("act: ", act);
        // 此处只监听 TBG 代币的转账，用户卖出时是将 TBG 转到收款账户
        let isTransfer = act.account === TBG_TOKEN_COIN && act.name === "transfer"
        if (!isTransfer) {
            // todo
            // 调用的不是 EOS 或代币的转账方法
            logger.debug("The transfer method that is not called %s", TBG_TOKEN_SYMBOL);
            return result;
        }
        let { from, to, quantity, memo } = act.data;
        // 检查是否是转到释放池
        if (to !== TBG_FREE_POOL) {
            // todo
            // 收款帐号不符
            logger.debug(`receipt receiver does not match, ${ to } !== ${ TBG_FREE_POOL }`);
            return result;
        }
        // "account_name,price,trx_type,amount"
        let [ account_name, price, trx_type, tradeAmount ] = memo.split(",");
        if (!account_name || !price || !trx_type) {
            logger.debug("invalid memo, memo must be include account_name, price, trx_type, amount format like 'account_name,price,trx_type,amount'")
            return result;
        }
        let [ amount, symbol ] = quantity.split(" ");
        if (symbol === TBG_TOKEN_SYMBOL) {
            result["price"] = price;
            result["from"] = from;
            result["amount"] = amount;
            result["symbol"] = symbol;
            result["trx_type"] = trx_type;
            result["trade_amount"] = tradeAmount;
            return result;
        } else {
            // todo
            // 代币符号不符
            logger.debug("invalid asset symbol, symbol must be UE or TBG");
            return result;
        }
    } catch (err) {
        throw err;
    }
}

async function getLastPos(){    
    let lastPosStr = await redis.get(SELL_ASSETS_KEY);
    if(!lastPosStr){
        await redis.set(SELL_ASSETS_KEY, 0);
        return 0;
    }
    return parseInt(lastPosStr) + 1;
}

/**
 * 设置收款账户 action 的最新的位置.
 * @param { number } seq
 */
async function setLastPos(seq){
    await redis.set(SELL_ASSETS_KEY, seq);
}

module.exports = handlerTransferActions;