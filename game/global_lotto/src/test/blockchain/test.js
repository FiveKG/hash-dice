// @ts-check
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");
let network = {
    main_net: "https://nodes.get-scatter.com"
}
// TBG1 收款账户
const WALLET_RECEIVER = "tbgjoin";
// TBG1 出款账户
const DISPENSE_ACCOUNT = "tbgjoin";
// EOS token 合约账户
const EOS_TOKEN = "eosio.token";
const EOS_TOKEN_SYMBOL = "EOS"
// UE token 合约账户
const UE_TOKEN = "uetokencoin";
const UE_TOKEN_SYMBOL = "UE"
// TBG token 合约账户
const TBG_TOKEN = "tbgtokencoin"
const TBG_TOKEN_SYMBOL = "TBG"
// 节点信息
const END_POINT = "http://localhost:8888"
// 私钥
const PRIVATE_KEY_TEST = "5KNrMrmiQ1fu3cwMdRCdh1bAfBcbyte2nJwB6evcB1By3fmwF6s,5KN7eEYR6xqCARDDCDRKNbqdL4q6oW24hK22qGvrRWiWbje41tB,5JXK3gnpUiLvnbxLbcHDTbgKHfVGNJTyVUkfWFGYJZ6Ucihj2sB,5JfAs6FQZ6pjr82BExuSBYUQMJR86bppEtWUcujMKGbv4BQ4BCn,5J2GxxF4xCfAZjP9R26jwnVY8rp8FYqXRE1fJPq5KDMSxa5NRuW,5K3LFVo36rAYBuAGC1UQmrZtrtvLkuWVYQ6TyhzwBgB2DpHo4zB,5K56kFugCU8UwbREvaZ8DTnH45q1LCMCQwp6xRHTGmxZVpUxBtt,5Kd5ExHx2AZwcnfFsQwNuiMvbeZvk1WGBD1iyc4FjwT5WBmDEF6,5JrN9PmaBTuDuoDBhYPwVsBmjTwtdpeGg4LN1sTCzv8igZgtxrx,5JZH8pBYdr3yfZnDhPtZzu9437tRoUJVCny8DvtCx1kbBh6KqyW,5JSZgw2fuoeXLXzwoQyBJ3L9vwH7AoQxjwBQRar4G2jqXnfrSXW,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG,5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h,5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG"


;(async ()=> {
    try {
        const signatureProvider = new JsSignatureProvider(PRIVATE_KEY_TEST.split(","));
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

        const GLOBAL_LOTTO_CONTRACT = "globallotto"
        
        // 获取区块链信息
        // const { head_block_num, head_block_time } = await rpc.get_info();
        // // 根据当前区块获取到时间戳和交易 id
        // const { id, timestamp } = await rpc.get_block(head_block_num);
        // console.debug("%s %d %s", timestamp, head_block_num, id, head_block_time);

        // getCurrencyBalance(UE_TOKEN, 'dengderong', 'UE')
        // .then(res => console.debug("res: ", res))
        // .catch(err => console.error("caught exception: ", err));
        
        rpc.get_table_rows({
            code: GLOBAL_LOTTO_CONTRACT,
            json: true,
            limit: 10,
            lower_bound: 1,
            scope: GLOBAL_LOTTO_CONTRACT,
            table: 	"lottogame",
            upper_bound: 10
        }).then(resp => {
            console.debug("get_table_rows: ", resp)
        }).catch(err => console.error("caught exception: ", err));
        // const contract = await api.getContract(GLOBAL_LOTTO_CONTRACT);
        // console.debug("contract: %O", contract);

        const act = { 
            account: GLOBAL_LOTTO_CONTRACT,
            name: 'init',
            authorization: [ { actor: GLOBAL_LOTTO_CONTRACT, permission: 'active' } ],
            data:
            { 
                game_id: 2,
                create_time: "2019-09-19T02:00:00",
                dead_line: "2019-09-19T03:59:59" 
            } 
        }

        // await api.transact({ actions: [ act ] }, {
        //     blocksBehind: 3,
        //     expireSeconds: 30,
        // }).then(resp => {
        //     console.debug("resp: ", resp);
        // })

        await clearTable(GLOBAL_LOTTO_CONTRACT, 1, "lottogame", true, PRIVATE_KEY_TEST.split(","))
        await clearTable(GLOBAL_LOTTO_CONTRACT, 1, "rewardlotto", true, PRIVATE_KEY_TEST.split(","))
        await clearTable(GLOBAL_LOTTO_CONTRACT, 1, "betlotto", true, PRIVATE_KEY_TEST.split(","))
        
        
        // console.debug("resp: ", resp)

        // transfer(UE_TOKEN, UE_TOKEN, 'eoslottoeos', '10.0000 UE', 'memo', PRIVATE_KEY_TEST.split(","))
        // .then(res => console.error(res))
        // .catch(err => console.error(err));
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

/**
 * 删除数据
 * @param { string } tokenContract 代币合约用户
 * @param { number } game_id 游戏期数
 * @param { string } table_name 表名
 * @param { boolean } flag 是否删除表中全部数据
 * @param { string[] } privateKeyList 私钥数组
 */
async function clearTable(tokenContract, game_id, table_name, flag, privateKeyList) {
    try {
        let api = await newApi(privateKeyList);
        let actions = {
            actions: [{
              account: tokenContract,
              name: "clear",
              authorization: [{
                actor: tokenContract,
                permission: 'active',
              }],
              data: {
                game_id: game_id,
                table_name: table_name,
                flag: flag
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