// @ts-check
const { JsonRpc } = require("eosjs");
const fetch = require("node-fetch");
const { redis } = require("../../common");

let network = {
    main_net: "https://nodes.get-scatter.com"
}

const EOSIO_TOKEN = "eosio.token";
const WALLET_RECEIVER = "yujinsheng11";
const HGB_TOKEN = "neweoscreate"

;(async ()=> {
    try {
        // await handlerTransferActions();
        await testGetAction(1000);
        process.exit(0);
    } catch (err) {
        throw err;
    }
})();

async function testGetAction(ms) {
    try {
        await handlerTransferActions();
        await sleep(ms);
        await testGetAction(ms)
    } catch (err) {
        throw err;
    }
}

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

async function getTrxAction(actionSeq) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(network.main_net, { fetch });
        const resp = await rpc.history_get_actions(WALLET_RECEIVER, actionSeq, 9);
        return resp.actions;
    } catch (err) {
        throw err;
    }
}

async function handlerTransferActions() {
    try {
        let actionSeq = await getLastPos();
        let actions = await getTrxAction(actionSeq);
        // console.log("actions: ", actions);
        for (let action of actions) {
            // console.log(action);
            let result = await parseEosAccountAction(action);
            if (!result) {
                continue;
            }
            let actionSeq = await redis.get(`tbg:invest:trx:${ result.account_action_seq }`);
            // console.log("result.account_action_seq: ", result.account_action_seq);
            if (actionSeq) {
                await setLastPos(result.account_action_seq);
                await redis.set("tbg:account_action_seq", result.account_action_seq);
                continue;
            }
            await redis.set(`tbg:invest:trx:${ result.account_action_seq }`, result.trx_id);
            await setLastPos(result.account_action_seq);
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
        // if (WALLET_RECEIVER !== receipt.receiver) {
        //     // todo
        //     // 收款帐号不符
        //     console.log("receipt receiver does not match");
        //     return result;
        // }

        let isTransfer = (act.account !== EOSIO_TOKEN || act.account !== HGB_TOKEN) && act.name !== "transfer"
        if (isTransfer) {
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
        if (memo.toLowerCase() !== "tbg_invest") {
            // todo
            // memo 格式不符
            console.log("invalid memo");
            return result;
        }

        let [ amount, symbol ] = quantity.split(" ");
        if (symbol !== "EOS" || symbol !== "HGB") {
            // todo
            // 代币符号不符
            console.log("invalid asset symbol");
            return result;
        }

        if (parseInt(amount) !== 30) {
            // todo
            // 转帐额度不符
            console.log("invalid quantity");
            return result;
        }

        result["from"] = from;
        result["amount"] = amount;
        return result;
    } catch (err) {
        throw err;
    }
}

async function getLastPos(){    
    let lastPosStr = await redis.get("tbg:account_action_seq");
    let lastPos = parseInt(lastPosStr);
    if(isNaN(lastPos)){
        //logger.debug(`未获取到 ${gameResultLastPosKey} 对应的数据。`);
        return 1300;
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