// @ts-check
const { Api, JsonRpc,RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { END_POINT } = require("../common/constant/eosConstants.js");
const sleep = require("./sleep")
const logger = require("../common/logger.js").child({ "@src/job/handlerTransfer.js": "transfer to eos" });
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
 * @param {{  
 *     tokenContract : String,
 *     from          : String,
 *     to            : String,
 *     quantity      : String,
 *     memo          : String,
 *     privateKeyList: Array      }} transfer_data
 */
async function transfer(transfer_data) {
    try {
        const {tokenContract,from,to,quantity,memo,privateKeyList} = transfer_data;
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
        await sleep(5 * 1000);
        try{  
          logger.debug("transfer action begin: ", actions);
          const result = await api.transact(actions, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          return result;
        }catch(err) {
          // 判断是不是双花错误，是的花再执行一遍
          if (err instanceof RpcError) {
              if (err.json.error.code === 3040008) {
                  logger.debug("after err action begin: ", actions);
                  await sleep(5 * 1000);
                  const result = await api.transact({ actions: [ actions ] }, {
                      blocksBehind: 3,
                      expireSeconds: 30,
                  });
                  logger.debug("after err action result: ", result);
              }
          }
        }
          
    } catch (err) {
        throw err;
    }
}

module.exports = transfer;