// @ts-check
require("../../setEnv.js")();
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "listening invest transfer" });
const { getTrxAction } = require("./getTrxAction.js");
const { redis } = require("../common");
const userInvestment = require("../businessLogic/account/userInvestment.js");
const { WALLET_RECEIVER, EOS_TOKEN, TBG_TOKEN, BASE_AMOUNT, UE_TOKEN } = require("../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");
const { scheduleJob } = require("node-schedule");
const INVEST_KEY = "tbg:invest:account_action_seq";

logger.debug(`handlerTransferActions running...`);
// 每秒中执行一次,有可能上一条监听的还没有执行完毕,下一次监听又再执行了一次,从而造成多条数据重复
const INVEST_LOCK = `tbg:lock:invest`;
let count = 1;
scheduleJob("*/1 * * * * *", begin);
// 如果中途断开，再次启动时计数到 10 以后清除缓存
async function begin() {
    try {
        const investLock = await redis.get(INVEST_LOCK);
        if (!investLock) {
            await handlerTransferActions();
            count = 0;
        } else {
            if (count > 10)  {
                await redis.del(INVEST_LOCK);
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
        await redis.set(INVEST_LOCK, 1);
        const actionSeq = await getLastPos();
        const actions = await getTrxAction(WALLET_RECEIVER, actionSeq);
        logger.debug("actionSeq: ", actionSeq);
        for (const action of actions) {
            const result = await parseEosAccountAction(action);
            const trxSeq = await redis.get(`tbg:invest:trx:${ result.account_action_seq }`);
            logger.debug("result: ", result, "trxSeq: ", trxSeq);
            // 如果处理过或者返回条件不符，直接更新状态，继续处理下一个
            if (trxSeq || !result.invest_type) {
                await setLastPos(result.account_action_seq);
                await redis.set(INVEST_KEY, result.account_action_seq);
                continue;
            }
            let userInvestmentRemark = ``;
            logger.debug("result.from: ", result.from, typeof result.from, "result.invest_type: ", result.invest_type, typeof result.invest_type, result.from !== result.invest_type);
            if (result.from !== result.invest_type) {
                userInvestmentRemark = `user ${ result.from } help user ${ result.invest_type } invest ${ result.amount } UE`;
            } else {
                userInvestmentRemark = `${ result.from } investment ${ result.amount } UE`;
            }
            await userInvestment(Number(result.amount), result.from, userInvestmentRemark);
            await redis.set(`tbg:invest:trx:${ result.account_action_seq }`, result.trx_id);
            await setLastPos(result.account_action_seq);
        }
        await redis.del(INVEST_LOCK);
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
            logger.debug("The transfer method that is not called UE or HGB");
            return result;
        }
        let { from, to, quantity, memo } = act.data;
        if (to !== WALLET_RECEIVER) {
            // todo
            // 收款帐号不符
            logger.debug(`receipt receiver does not match, ${ to } !== ${ WALLET_RECEIVER }`);
            return result;
        }
        let [ invest, user ] = memo.split(":");
        if (invest !== "tbg_invest") {
            // todo
            // memo 格式不符
            logger.debug(`invalid memo, ${ invest } !== "tbg_invest"`);
            return result;
        }
        let [ amount, symbol ] = quantity.split(" ");
        if (symbol === "UE" || symbol === "TBG") {
            if (!new  Decimal(amount).eq(BASE_AMOUNT)) {
                // todo
                // 转帐额度不符
                logger.debug(`invalid quantity, amount must be ${ BASE_AMOUNT }, but get ${ amount }`);
                return result;
            }

            if (user !== from) {
                result["invest_type"] = user;
            } else {
                result["invest_type"] = from;
            }

            result["from"] = from;
            result["amount"] = amount;
            result["symbol"] = symbol;
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
    let lastPosStr = await redis.get(INVEST_KEY);
    if(!lastPosStr){
        await redis.set(INVEST_KEY, 0);
        return 0;
    }
    return parseInt(lastPosStr) + 1;
}

/**
 * 设置收款账户 action 的最新的位置.
 * @param { number } seq
 */
async function setLastPos(seq){
    await redis.set(INVEST_KEY , seq);
}

module.exports = handlerTransferActions;