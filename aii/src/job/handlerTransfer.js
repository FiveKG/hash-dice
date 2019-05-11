// @ts-check
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { SCATTER_NET, PRIVATE_KEY_TEST } = require("../common/constant/eosConstants.js");

async function newApi() {
    try {
        const signatureProvider = new JsSignatureProvider([PRIVATE_KEY_TEST]);
        // @ts-ignore
        const rpc = new JsonRpc(SCATTER_NET, { fetch });
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        return api;
    } catch (err) {
        throw err;
    }
}

async function transfer(tokenContract, from, to, quantity, memo) {
    try {
        let api = await newApi();
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

module.exports = transfer;