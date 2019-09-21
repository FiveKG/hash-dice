// @ts-check
const sleep = require("../../job/sleep.js");
const { redis } = require("../../common");
const { pool } = require("../../db");
const GLOBAL_LOTTO_KEY = "tbg:hash_dice:account_action_seq";

// @ts-check
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                   // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN, UE_TOKEN } = require("../../common/constant/eosConstants.js");
// @ts-ignore
const rpc = new JsonRpc(END_POINT, { fetch });
/**
 * 
 * @param { number } a 
 * @param { number } b 
 * @param { number } c 
 * @param { number } d 
 * @param { number } e 
 */
function getInfo(a, b, c, d, e) {
    console.debug(a, b, c, d, e);
}


;(async () => {
    let result= await getLastPos()
    console.log(result)
})();


async function getLastPos(){    
    let lastPosStr = await redis.get(GLOBAL_LOTTO_KEY);
    if(!lastPosStr){
        await redis.set(GLOBAL_LOTTO_KEY, 0);
        return 0;
    }
    return parseInt(lastPosStr) + 1;
}