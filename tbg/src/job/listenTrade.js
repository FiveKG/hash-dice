// @ts-check
// require("../../setEnv.js")();
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "listening trade transfer" });
const { getTrxAction } = require("./getTrxAction.js");
const { redis, generate_primary_key } = require("../common");
const userInvestment = require("../businessLogic/account/userInvestment.js");
const { WALLET_RECEIVER, EOS_TOKEN, TBG_TOKEN, BASE_AMOUNT, UE_TOKEN, UE_TOKEN_SYMBOL, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");
const { scheduleJob } = require("node-schedule");
const { TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const buyAssets = require("./buyAssets");
const raiseAirdrop = require("./raiseAirdrop");
const { RAISE, BUY, FIRST_BUY, SELL } = require("../common/constant/optConstants");
const sellAssets = require("./sellAssets.js");
const SEQ_KEY = "tbg:trade:account_action_seq"

logger.debug(`listenTrade running...`);
// 每秒中执行一次,有可能上一条监听的还没有执行完毕,下一次监听又再执行了一次,从而造成多条数据重复
const TRADE_LOCK = `tbg:lock:trade`;
let count = 1;
scheduleJob("*/1 * * * * *", begin);
// redis.del(TRADE_LOCK);
// begin();
async function begin() {
    try {
        const investLock = await redis.get(TRADE_LOCK);
        if (!investLock) {
            await listenTrade();
            count = 0;
        } else {
            if (count > 10)  {
                await redis.del(TRADE_LOCK);
            } else {
                count += 1;
            }
            return;
        }
    } catch (err) {
        throw err;
    }
}

async function listenTrade() {
    try {
        await redis.set(TRADE_LOCK, 1);
        const actionSeq = await getLastPos();
        const actions = await getTrxAction(TBG_FREE_POOL, actionSeq);
        logger.debug("actionSeq: ", actionSeq);
        for (const action of actions) {
            const result = await parseEosAccountAction(action);
            const trxSeq = await redis.get(`tbg:trade:trx:${ result.account_action_seq }`);
            logger.debug("result: ", result, "trxSeq: ", trxSeq);
            // 如果处理过或者返回条件不符，直接更新状态，继续处理下一个
            if (trxSeq || !result.trx_type) {
                await setLastPos(result.account_action_seq);
                await redis.set(SEQ_KEY, result.account_action_seq);
                continue;
            }

            // 监听到用户购买资产包后，执行相应的逻辑
            if (result.trx_type === RAISE) {
                await raiseAirdrop({ accountName: result.from, price: Number(result.price) });
            } 
            
            if (result.trx_type === BUY) {
                await buyAssets({ accountName: result.from, price: Number(result.price), apId: Number(result.assets_package_id) })
            }

            // 监听到用户购买资产包后，执行相应的逻辑
            if (result.trx_type === SELL) {
                await sellAssets({ accountName: result.from, price: Number(result.price), trade_amount: Number(result.trade_amount)});
            }
            
            await redis.set(`tbg:trade:trx:${ result.account_action_seq }`, result.trx_id);
            await setLastPos(result.account_action_seq);
        }
        await redis.del(TRADE_LOCK);
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
            "invest_type": "",
            "trade_amount": "",
            "price": "",
            "trx_type": "",
            "assets_package_id": ""
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
        let isTransfer = (act.account === UE_TOKEN || act.account === TBG_TOKEN) && act.name === "transfer"
        if (!isTransfer) {
            // todo
            // 调用的不是 EOS 或代币的转账方法
            logger.debug("The transfer method that is not called UE or TBG");
            return result;
        }
        let { from, to, quantity, memo } = act.data;
        if (to === TBG_FREE_POOL) {
            let [ amount, symbol ] = quantity.split(" ");
            if (symbol === UE_TOKEN_SYMBOL) {
                // "account_name,price,trx_type,assets_package_id"
                let [ account_name, price, trx_type, assets_package_id ] = memo.split(",");
                if (!account_name || !price || !trx_type) {
                    logger.debug("invalid memo, memo must be include account_name, price, trx_type, assets_package_id format like 'account_name,price,trx_type,assets_package_id'")
                    return result;
                }
                result["price"] = price;
                result["from"] = from;
                result["amount"] = amount;
                result["symbol"] = symbol;
                result["trx_type"] = trx_type;
                result["assets_package_id"] = assets_package_id;
                return result;
            } else if (symbol === TBG_TOKEN_SYMBOL) {
                // "account_name,price,trx_type,amount"
                let [ account_name, price, trx_type, tradeAmount ] = memo.split(",");
                if (!account_name || !price || !trx_type) {
                    logger.debug("invalid memo, memo must be include account_name, price, trx_type, amount format like 'account_name,price,trx_type,amount'")
                    return result;
                }
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
        } else {
            logger.debug(`receipt receiver does not match, ${ to } !== ${ TBG_FREE_POOL }`);
            return result;
        }
    } catch (err) {
        throw err;
    }
}

async function getLastPos(){    
    let lastPosStr = await redis.get(SEQ_KEY);
    if(!lastPosStr){
        await redis.set(SEQ_KEY, 0);
        return 0;
    }
    return parseInt(lastPosStr) + 1;
}

/**
 * 设置收款账户 action 的最新的位置.
 * @param { number } seq
 */
async function setLastPos(seq){
    await redis.set(SEQ_KEY , seq);
}

module.exports = listenTrade;