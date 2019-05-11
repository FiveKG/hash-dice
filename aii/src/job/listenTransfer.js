// @ts-check
const getTrxAction = require("./getTrxAction.js");
const { redis } = require("../common");
const userInvestment = require("../businessLogic/account/userInvestment.js");
const { WALLET_RECEIVER, EOS_TOKEN, TBG_TOKEN, BASE_AMOUNT } = require("../common/constant/eosConstants.js");

async function handlerTransferActions() {
    try {
        let actionSeq = await getLastPos();
        let actions = await getTrxAction(actionSeq);
        // console.log("actions: ", actions);
        for (let action of actions) {
            // console.log(action);
            let result = await parseEosAccountAction(action);
            let actionSeq = await redis.get(`tbg:invest:trx:${ result.account_action_seq }`);
            console.log("result: ", result, "actionSeq: ", actionSeq);
            // 如果处理过或者返回条件不符，直接更新状态，继续处理下一个
            if (actionSeq || !result.invest_type) {
                await setLastPos(result.account_action_seq);
                await redis.set("tbg:account_action_seq", result.account_action_seq);
                continue;
            }
            let userInvestmentRemark = ``;
            if (result.from === result.invest_type) {
                userInvestmentRemark = `user ${ result.from } help user ${ result.invest_type } invest ${ result.amount } EOS`;
            } else {
                userInvestmentRemark = `${ result.from } investment ${ result.amount } EOS`;
            }
            let statusCode = await userInvestment(Number(result.amount), result.from, userInvestmentRemark);
            await redis.set(`tbg:invest:trx:${ result.account_action_seq }`, result.trx_id);
            await setLastPos(result.account_action_seq);
            console.log("invest statusCode: ", statusCode);
        }
    } catch (err) {
        throw err;
    }
}

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
            console.log("actionTrace is null");
            return result;
        }
        if (!actionTrace.receipt) {
            // todo
            console.log("actionTrace.receipt is null");
            return result;
        }
        if (!actionTrace.act) {
            // todo
            console.log("actionTrace.act is null");
            return result;
        }
        if (!actionTrace.trx_id) {
            // todo
            console.log("actionTrace.trx_id is null");
            return result;
        }
        result["trx_id"] = actionTrace.trx_id;
        console.log(`trx_id: ${ actionTrace.trx_id } -- account_action_seq: ${ action.account_action_seq }`);
        let { receipt, act } = actionTrace;
        let isTransfer = (act.account === EOS_TOKEN || act.account === TBG_TOKEN) && act.name === "transfer"
        if (!isTransfer) {
            // todo
            // 调用的不是 EOS 或代币的转账方法
            console.log("The transfer method that is not called EOS or HGB");
            return result;
        }
        let { from, to, quantity, memo } = act.data;
        if (to !== WALLET_RECEIVER) {
            // todo
            // 收款帐号不符
            console.log("receipt receiver does not match");
            return result;
        }
        let [ invest, user ] = memo.split(":");
        if (invest !== "tbg_invest") {
            // todo
            // memo 格式不符
            console.log("invalid memo");
            return result;
        }
        let [ amount, symbol ] = quantity.split(" ");
        if (symbol === "EOS" || symbol === "TBG") {
            if (amount !== BASE_AMOUNT) {
                // todo
                // 转帐额度不符
                console.log("invalid quantity");
                return result;
            }

            if (user !== from) {
                result["invest_type"] = user;
            } else {
                result["invest_type"] = from;
            }

            result["from"] = from;
            result["amount"] = amount;
            return result;
        } else {
            // todo
            // 代币符号不符
            console.log("invalid asset symbol");
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
        return 1300;
    }
    return lastPos + 1;
}

/**
 * 设置收款账户 action 的最新的位置.
 * @param { Number } seq
 */
async function setLastPos(seq){
    await redis.set("tbg:account_action_seq" , seq);
}

module.exports = handlerTransferActions;