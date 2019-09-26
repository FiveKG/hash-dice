// @ts-check
// require("../../setEnv.js")();
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "listening game receiver" });
const { getTrxAction } = require("./getTrxAction.js");
const { redis, generate_primary_key } = require("../common");
const { UE_TOKEN, UE_TOKEN_SYMBOL, TBG_WALLET_RECEIVER: a } = require("../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");
const { scheduleJob } = require("node-schedule");
const handlerGameReceiver = require("./handlerGameReceiver.js");
const SEQ_KEY = "tbg:tbg_game:account_action_seq"
const TBG_WALLET_RECEIVER = 'luckyhongbao'
logger.debug(`listenTrade running...`);
// 每秒中执行一次,有可能上一条监听的还没有执行完毕,下一次监听又再执行了一次,从而造成多条数据重复
const TRADE_LOCK = `tbg:lock:tbg_game`;
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
        const actions = await getTrxAction(TBG_WALLET_RECEIVER, actionSeq);
        logger.debug("actionSeq: ", actionSeq);
        for (const action of actions) {
            const result = await parseEosAccountAction(action);
            const trxSeq = await redis.get(`tbg:tbg_game:trx:${ result.account_action_seq }`);
            logger.debug("result: ", result, "trxSeq: ", trxSeq);
            // 如果处理过或者返回条件不符，直接更新状态，继续处理下一个
            if (trxSeq || !result.game_name || !result.game_amount || !result.account_name) {
                await setLastPos(result.account_action_seq);
                await redis.set(SEQ_KEY, result.account_action_seq);
                continue;
            }
            
            const data = { 
                "account_name": result.account_name, 
                "game_name": result.game_name, 
                "game_amount": result.game_amount, 
                "amount": result.amount 
            
            }
            // @ts-ignore
            await handlerGameReceiver(data)
            await redis.set(`tbg:tbg_game:trx:${ result.account_action_seq }`, result.trx_id);
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
            "amount": null,
            "from": "",
            "symbol": "",
            "game_name": "",
            "trade_amount": "",
            "account_name": "",
            "game_amount": null,
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
        // 只监听 UE 转账
        let isTransfer = act.account === UE_TOKEN && act.name === "transfer"
        if (!isTransfer) {
            // todo
            // 调用的不是 EOS 或代币的转账方法
            logger.debug("The transfer method that is not called UE or TBG");
            return result;
        }
        let { from, to, quantity, memo } = act.data;
        if (to === TBG_WALLET_RECEIVER) {
            let [ amount, symbol ] = quantity.split(" ");
            if (symbol === UE_TOKEN_SYMBOL) {
                // 判断是不是 json 字符串
                if (memo.search("{") < 0) {
                    logger.debug("invalid memo format");
                    return result;
                }
                console.debug("memo")
                let { game_name, account_name, amount: game_amount } = JSON.parse(memo);
                if (!account_name || !account_name || !account_name) {
                    logger.debug("invalid memo, memo must be include game_name, account_name, amount format like '{ game_name: string, account_name: string, amount: number }'")
                    return result;
                }

                const game = [ "globallotto", "treasure", "luckyhongbao", "hashdice", "minlottery" ]
                if (game.includes(game_name)) {
                    result["amount"] = amount;
                    result["symbol"] = symbol;
                    result["from"] = from;
                    result["amount"] = amount;
                    result["game_name"] = game_name;
                    result["account_name"] = account_name;
                    result["game_amount"] = game_amount;
                    return result;
                } else {
                    logger.debug("invalid game type");
                    return result;
                }               
            } else {
                // todo
                // 代币符号不符
                logger.debug("invalid asset symbol, symbol must be UE or TBG");
                return result;
            }
        } else {
            logger.debug(`receipt receiver does not match, ${ to } !== ${ TBG_WALLET_RECEIVER }`);
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