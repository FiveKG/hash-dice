// @ts-check
const { getTrxAction } = require("./getTrxAction.js");
const { redis } = require("../common");
const userInvestment = require("../businessLogic/account/userInvestment.js");
const { WALLET_RECEIVER, EOS_TOKEN, TBG_TOKEN, BASE_AMOUNT } = require("../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");

async function handlerTransferActions() {
    try {
        const actionSeq = await getLastPos();
        const actions = await getTrxAction(actionSeq);
        console.debug("actionSeq: ", actionSeq);
        for (const action of actions) {
            console.debug(action);
            const result = await parseEosAccountAction(action);
            const trxSeq = await redis.get(`tbg:invest:trx:${ result.account_action_seq }`);
            console.debug("result: ", result, "trxSeq: ", trxSeq);
            // 如果处理过或者返回条件不符，直接更新状态，继续处理下一个
            if (trxSeq || !result.invest_type) {
                await setLastPos(result.account_action_seq);
                await redis.set("tbg:account_action_seq", result.account_action_seq);
                continue;
            }
            let userInvestmentRemark = ``;
            console.debug("result.from: ", result.from, typeof result.from, "result.invest_type: ", result.invest_type, typeof result.invest_type, result.from !== result.invest_type);
            if (result.from !== result.invest_type) {
                userInvestmentRemark = `user ${ result.from } help user ${ result.invest_type } invest ${ result.amount } UE`;
            } else {
                userInvestmentRemark = `${ result.from } investment ${ result.amount } UE`;
            }
            await userInvestment(number(result.amount), result.from, userInvestmentRemark);
            await redis.set(`tbg:invest:trx:${ result.account_action_seq }`, result.trx_id);
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
            "invest_type": "",
        }
        let actionTrace = action.action_trace;
        if (!actionTrace) {
            // todo
            console.debug("actionTrace is null");
            return result;
        }
        if (!actionTrace.receipt) {
            // todo
            console.debug("actionTrace.receipt is null");
            return result;
        }
        if (!actionTrace.act) {
            // todo
            console.debug("actionTrace.act is null");
            return result;
        }
        if (!actionTrace.trx_id) {
            // todo
            console.debug("actionTrace.trx_id is null");
            return result;
        }
        result["trx_id"] = actionTrace.trx_id;
        console.debug(`trx_id: ${ actionTrace.trx_id } -- account_action_seq: ${ action.account_action_seq }`);
        let { receipt, act } = actionTrace;
        console.debug("act: ", act);
        let isTransfer = (act.account === EOS_TOKEN || act.account === TBG_TOKEN) && act.name === "transfer"
        if (!isTransfer) {
            // todo
            // 调用的不是 EOS 或代币的转账方法
            console.debug("The transfer method that is not called UE or HGB");
            return result;
        }
        let { from, to, quantity, memo } = act.data;
        if (to !== WALLET_RECEIVER) {
            // todo
            // 收款帐号不符
            console.debug(`receipt receiver does not match, ${ to } !== ${ WALLET_RECEIVER }`);
            return result;
        }
        let [ invest, user ] = memo.split(":");
        if (invest !== "tbg_invest") {
            // todo
            // memo 格式不符
            console.debug(`invalid memo, ${ invest } !== "tbg_invest"`);
            return result;
        }
        let [ amount, symbol ] = quantity.split(" ");
        if (symbol === "UE" || symbol === "TBG") {
            if (!new  Decimal(amount).eq(BASE_AMOUNT)) {
                // todo
                // 转帐额度不符
                console.debug(`invalid quantity, amount must be ${ BASE_AMOUNT }, but get ${ amount }`);
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
            console.debug("invalid asset symbol, symbol must be UE or TBG");
            return result;
        }
    } catch (err) {
        throw err;
    }
}

async function getLastPos(){    
    let lastPosStr = await redis.get("tbg:account_action_seq");
    let lastPos = parseInt(lastPosStr);
    if(isNaN(lastPos)){
        await redis.set("tbg:account_action_seq", 0);
        return 0;
    }
    return lastPos + 1;
}

/**
 * 设置收款账户 action 的最新的位置.
 * @param { number } seq
 */
async function setLastPos(seq){
    await redis.set("tbg:account_action_seq" , seq);
}

module.exports = handlerTransferActions;