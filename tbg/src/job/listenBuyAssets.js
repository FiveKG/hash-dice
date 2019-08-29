// @ts-check
const logger = require("../common/logger.js").child({ "@": "listening user buy asset package" });
const { getTrxAction } = require("./getTrxAction.js");
const { redis } = require("../common");
const { UE_TOKEN, WALLET_RECEIVER } = require("../common/constant/eosConstants.js");
const { RAISE, BUY, FIRST_BUY } = require("../common/constant/optConstants");
const { TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const buyAssets = require("./buyAssets");
const raiseAirdrop = require("./raiseAirdrop");
const BUY_ASSETS_KEY = "tbg:buy_assets:account_action_seq";
const { scheduleJob } = require("node-schedule");

logger.debug(`beginListenAction running...`);
scheduleJob("*/1 * * * * *", handlerTransferActions);

async function handlerTransferActions() {
    try {
        const actionSeq = await getLastPos();
        const actions = await getTrxAction(UE_TOKEN, actionSeq);
        logger.debug("actionSeq: ", actionSeq);
        for (const action of actions) {
            logger.debug(action);
            const result = await parseEosAccountAction(action);
            const trxSeq = await redis.get(`tbg:buy:trx:${ result.account_action_seq }`);
            logger.debug("result: ", result, "trxSeq: ", !!trxSeq, !result.trx_type);
            // 如果处理过或者返回条件不符，直接更新状态，继续处理下一个
            if (!!trxSeq || !result.trx_type) {
                await setLastPos(result.account_action_seq);
                await redis.set(BUY_ASSETS_KEY, result.account_action_seq);
                continue;
            }

            // 监听到用户购买资产包后，执行相应的逻辑
            if (result.trx_type === RAISE) {
                await raiseAirdrop({ accountName: result.from, price: Number(result.price) });
            } 
            
            if (result.trx_type === BUY) {
                await buyAssets({ accountName: result.from, price: Number(result.price), apId: Number(result.assets_package_id) })
            }
            await redis.set(`tbg:buy:trx:${ result.account_action_seq }`, result.trx_id);
            await setLastPos(result.account_action_seq);
        }
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
            "assets_package_id": "",
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
        logger.debug("act: ", act);
        // 此处只监听 UE 代币的转账
        let isTransfer = act.account === UE_TOKEN && act.name === "transfer"
        if (!isTransfer) {
            // todo
            // 调用的不是 EOS 或代币的转账方法
            logger.debug("The transfer method that is not called UE or HGB");
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
        // "account_name,price,trx_type,assets_package_id"
        let [ account_name, price, trx_type, assets_package_id ] = memo.split(",");
        if (!account_name || !price || !trx_type) {
            logger.debug("invalid memo, memo must be include account_name, price, trx_type, assets_package_id format like 'account_name,price,trx_type,assets_package_id'")
            return result;
        }
        let [ amount, symbol ] = quantity.split(" ");
        if (symbol === "UE") {
            result["price"] = price;
            result["from"] = from;
            result["amount"] = amount;
            result["symbol"] = symbol;
            result["trx_type"] = trx_type;
            result["assets_package_id"] = assets_package_id;
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
    let lastPosStr = await redis.get(BUY_ASSETS_KEY);
    if(!lastPosStr){
        await redis.set(BUY_ASSETS_KEY, 0);
        return 0;
    }
    return parseInt(lastPosStr) + 1;
}

/**
 * 设置收款账户 action 的最新的位置.
 * @param { number } seq
 */
async function setLastPos(seq){
    await redis.set(BUY_ASSETS_KEY, seq);
}

module.exports = handlerTransferActions;