// @ts-check
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { END_POINT } = require("../common/constant/eosConstants.js");

/**
 * 
 * @param { string } accountName 
 * @param { number } actionSeq 
 */
async function getTrxAction(accountName, actionSeq) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        const resp = await rpc.history_get_actions(accountName, actionSeq, 9);
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

// getCurrencyBalance(TBG_TOKEN, TBG_TOKEN, TBG_TOKEN_SYMBOL).then().catch(err => console.error(err));
// getTrxAction(0).then(res => console.debug(res[0].action_trace.act)).catch(err => console.error(err))
// getTransaction("").then(res => {
//     for (const info of res.traces) {
//         console.debug(info.act);
//     }
// }).catch(err => console.error(err))

module.exports = {
    getTrxAction,
    getCurrencyStats,
    getCurrencyBalance,
    getTransaction
}