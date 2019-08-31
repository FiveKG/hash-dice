// @ts-check
const { redis } = require("../../common");
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN, UE_TOKEN, WALLET_RECEIVER } = require("../../common/constant/eosConstants.js");
const df = require("date-fns");
const { scheduleJob } = require("node-schedule");
let network = {
    main_net: "https://nodes.get-scatter.com"
}

;(async ()=> {
    try {
        // getCurrencyBalance(UE_TOKEN, 'dengderong', 'UE')
        // .then(res => console.error(res))
        // .catch(err => console.error(err));

        // transfer(UE_TOKEN, UE_TOKEN, 'dengderong', '1000000.0000 UE', 'memo', PRIVATE_KEY_TEST.split(","))
        // .then(res => console.error(res))
        // .catch(err => console.error(err));
        const now = df.format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
        const dayStart = df.startOfDay(now);
        const startTime = df.addHours(dayStart, 10);
        const endTime = df.addHours(dayStart, 21);
        const trxList = [];
        const actionList = [];
        // 如果在不再交易时间内, 交易结束时，没有完成的订单全部撤销，资金原路退回
        const flag = df.isWithinRange(new Date(), startTime, endTime)
        // console.debug(flag);

        const signatureProvider = new JsSignatureProvider(PRIVATE_KEY_TEST.split(","));
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        // scheduleJob("* * * * * *", async () => {
            
        // });
        // const head_block_num = await rpc.get_info(); 
        // const id = await rpc.get_block(head_block_num.head_block_num);
        // console.debug("head_block_num: %O, id: %O", head_block_num.head_block_time, id);

        // while (true) {
        //     await sleep(500);
        //     const { head_block_num, head_block_time } = await rpc.get_info();
        //     const { id, timestamp } = await rpc.get_block(head_block_num);
        //     console.debug("%s %d %s", timestamp, head_block_num, id, head_block_time);
        // }

        
        const account = 'gametestuser'
        const amount = "10000.0000"
        const symbol = "UE"
        const quantity = `${amount} ${symbol}`
        const memo = `tbg_invest:${account}`
        // const resp = await transfer(UE_TOKEN, 'yujinsheng11', 'tbgfreepool', quantity, 'yujinsheng11,0.05,raise,4', PRIVATE_KEY_TEST.split(","))
        // const resp = await transfer(UE_TOKEN, account, 'tbgfreepool', '101.1400 UE', 'gametestuser,1.0114,buy,2', PRIVATE_KEY_TEST.split(","));
        // const resp = await transfer(TBG_TOKEN, 'yujinsheng11', 'tbgfreepool', '101.1400 TBG', 'yujinsheng11,1.0114,sell,100', PRIVATE_KEY_TEST.split(","));
        // const resp = await getTrxAction(WALLET_RECEIVER, 0)
        // console.debug(resp)
    } catch (err) {
        throw err;
    }
})();

/**
 * 
 * @param { number } ms 
 */
async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    });
}


/**
 * 
 * @param { string } accountName 
 * @param { number } actionSeq 
 */
async function getTrxAction(accountName, actionSeq) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        const resp = await rpc.history_get_actions(accountName, actionSeq, 50);
        // console.debug("resp: ", resp.actions);
        return resp.actions;
    } catch (err) {
        throw err;
    }
}

/**
 * 获取代币发行信息
 * @param { string } code 代币合约
 * @param { string } symbol 代币符号
 */
async function getCurrencyStats(code, symbol) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        const resp = await rpc.get_currency_stats(code, symbol);
        // const { [TBG_TOKEN_SYMBOL]: { max_supply: maxSupply } } = resp;
        // console.debug("resp: ", resp);
        return resp;
    } catch (err) {
        throw err;
    }
}

/**
 * 获取用户代币资产
 * @param { string } code 代币合约
 * @param { string } account 账户名
 * @param { string } [symbol] 代币符号
 */
async function getCurrencyBalance(code, account, symbol) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        const resp = await rpc.get_currency_balance(code, account, symbol);
        // const { [TBG_TOKEN_SYMBOL]: { max_supply: maxSupply } } = resp;
        console.debug("resp: ", resp);
        return resp;
    } catch (err) {
        throw err;
    }
}

/**
 * 获取用户代币资产
 * @param { string } transactionId 交易 id
 */
async function getTransaction(transactionId) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
    


        const resp = rpc.history_get_transaction("d4688e098ce71b685fc1cdc80d33ecf7e87138aa6a90b495c3063c969816e834");
        
        return resp;
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param { String[] } privateKeyList 私钥数组
 */
async function newApi(privateKeyList) {
    try {
        const signatureProvider = new JsSignatureProvider(privateKeyList);
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        return api;
    } catch (err) {
        throw err;
    }
}

/**
 * 转帐
 * @param { String } tokenContract 代币合约用户
 * @param { String } from 转帐用户
 * @param { String } to 收款人
 * @param { String } quantity  额度
 * @param { String } memo 备注
 * @param { String[] } privateKeyList 私钥数组
 */
async function transfer(tokenContract, from, to, quantity, memo, privateKeyList) {
    try {
        let api = await newApi(privateKeyList);
        let actions = {
            actions: [{
              account: tokenContract,
              name: "transfer",
              authorization: [{
                actor: from,
                permission: 'active',
              }],
              data: {
                from: from,
                to: to,
                quantity: quantity,
                memo: memo,
              }
            }]
          }
        const result = await api.transact(actions, {
            blocksBehind: 3,
            expireSeconds: 30,
          });

          return result;
    } catch (err) {
        throw err;
    }
}