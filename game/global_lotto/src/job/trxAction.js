// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "处理转账动作" });
const { Decimal } = require("decimal.js");
const { END_POINT, PRIVATE_KEY_TEST } = require("../common/constant/eosConstants.js");
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { format } = require("date-fns");
const sleep = require("./sleep.js");


/**
 * 处理转账动作
 * @param { DataInfo[] } data
 */
async function trxAction(data) {
    try {
        const privateKeys = PRIVATE_KEY_TEST.split(",");
        const signatureProvider = new JsSignatureProvider(privateKeys);
        
        // 区块链事务执行
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        for (const actions of data) {
            // 隔十五秒再执行下一次转账
            await sleep(1 * 1000);
            try {
                console.debug("action begin: ", actions);
                // logger.debug("action begin: ", actions);
                const result = await api.transact({ actions: [ actions ] }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                logger.debug("action result: ", result);
            } catch (err) {
                // 判断是不是双花错误，是的花再执行一遍
                if (err instanceof RpcError) {
                    if (err.json.error.code === 3040008) {
                        logger.debug("after err action begin: ", actions);
                        await sleep(2 * 1000);
                        const result = await api.transact({ actions: [ actions ] }, {
                            blocksBehind: 3,
                            expireSeconds: 30,
                        });
                        logger.debug("after err action result: ", result);
                    }
                }
            }
            await sleep(3 * 1000);
        }
    } catch (err) {
        logger.error("transaction error, the error stock is %O", err);
        throw err;
    }
}

module.exports = trxAction

/**
 * @description
 * @typedef { object } DataInfo
 * @property { string } account
 * @property { string } name
 * @property { { actor: string, permission: string }[] } authorization
 * @property { { from: string, to: string, quantity: string, memo: string } } data
 */