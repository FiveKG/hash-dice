// @ts-check
const sleep = require("../../job/sleep.js");
const { redis } = require("../../common");
const { pool } = require("../../db");
const GLOBAL_LOTTO_KEY = "tbg:hash_dice:account_action_seq";
const { OPEN_CODE_COUNT } = require("../../common/constant/gameConstants");
// @ts-check
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                   // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN, BANKER,UE_TOKEN } = require("../../common/constant/eosConstants.js");
// @ts-ignore
const rpc = new JsonRpc(END_POINT, { fetch });
const logger = require("../../common/logger.js").child({ "@test.js": "test" });

const openGameSession = require("../../job/openGameSession")
const isReward = require("../../job/isReward")
let open_num = "";
let count = 0;

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
// for(let num of resp.id){
//     console.log(num)
//     if(!isNaN(Number(num))){
//         open_num += num;
//         console.log('aa')
//         count ++;
//         if (count === OPEN_CODE_COUNT) {
//             open_num =open_num.split('').reverse().join('')
//             //openResult.open_num = open_num
//             console.log("yes:",open_num)
//             break;
//         }
//     }
// }

// for(let index=resp.id.length;index>1;index--){
//         let num = resp.id[index];
//         if(!isNaN(Number(num))){
//         open_num += num;
//         count ++;
//         if (count === OPEN_CODE_COUNT) {
//             open_num =open_num.split('').reverse().join('')
//             //openResult.open_num = open_num
//             console.log("yes:",open_num)
//             break;
//         }
//     }
        
// }

// openGameSession(14081360)

// isReward({open_num:88,open_block_num:14087157})

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
        //console.debug("resp: ", resp);
        return resp;
    } catch (err) {
        throw err;
    }
}


let memo = "hash_dice:yujinsheng11:twins:2.0770"  
transfer(UE_TOKEN, UE_TOKEN, BANKER, '10.0000 UE', memo, PRIVATE_KEY_TEST.split(","))
.then(res => console.error(res))
.catch(err => console.error(err));

// getCurrencyBalance(UE_TOKEN, 'yujinsheng11', 'UE')
//         .then(res => console.error(res))
//         .catch(err => console.error(err));
