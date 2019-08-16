// @ts-check
const { JsonRpc } = require("eosjs");
const fetch = require("node-fetch");
const { WALLET_RECEIVER, END_POINT, TBG_TOKEN, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");

async function getTrxAction(actionSeq) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        const resp = await rpc.history_get_actions(WALLET_RECEIVER, actionSeq, 9);
        console.debug("resp: ", resp);
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

getCurrencyBalance(TBG_TOKEN, TBG_TOKEN, TBG_TOKEN_SYMBOL).then().catch(err => console.error(err));

module.exports = {
    getTrxAction,
    getCurrencyStats,
    getCurrencyBalance
}