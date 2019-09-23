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
const END_POINT = "http://45.251.109.187:8888"
// 私钥
const PRIVATE_KEY_TEST = "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo"


;(async ()=> {
    try {
        const signatureProvider = new JsSignatureProvider(PRIVATE_KEY_TEST.split(","));
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

        const LUCKY_HONGBAO_CONTRACT = "luckyhongbao"
        
        // 获取区块链信息
        // const { head_block_num, head_block_time } = await rpc.get_info();
        // // 根据当前区块获取到时间戳和交易 id
        // const { id, timestamp } = await rpc.get_block(head_block_num);
        // console.debug("%s %d %s", timestamp, head_block_num, id, head_block_time);

        // getCurrencyBalance(UE_TOKEN, 'dengderong', 'UE')
        // .then(res => console.debug("res: ", res))
        // .catch(err => console.error("caught exception: ", err));
        
        rpc.get_table_rows({
            code: LUCKY_HONGBAO_CONTRACT,
            json: true,
            limit: 10,
            lower_bound: 1,
            scope: LUCKY_HONGBAO_CONTRACT,
            table: 	"redpackets",
            upper_bound: 10
        }).then(resp => {
            console.debug("get_table_rows redpackets: ", resp)
        }).catch(err => console.error("caught exception: ", err));

        rpc.get_table_rows({
            code: LUCKY_HONGBAO_CONTRACT,
            json: true,
            limit: 10,
            lower_bound: 1,
            scope: LUCKY_HONGBAO_CONTRACT,
            table: 	"offer",
            upper_bound: 10
        }).then(resp => {
            console.debug("get_table_rows offer: ", resp)
        }).catch(err => console.error("caught exception: ", err));
        // const contract = await api.getContract(LUCKY_HONGBAO_CONTRACT);
        // console.debug("contract: %O", contract);

        const act = { 
            account: LUCKY_HONGBAO_CONTRACT,
            name: 'issue',
            authorization: [ { actor: LUCKY_HONGBAO_CONTRACT, permission: 'active' } ],
            data: {   
                packet_id: 1,
                amount: '0.0950 UE',
                owner: 'luckyhongbao',
                player_account: 5 
            } 
        }

        // await api.transact({ actions: [ act ] }, {
        //     blocksBehind: 3,
        //     expireSeconds: 30,
        // }).then(resp => {
        //     console.debug("resp: ", resp);
        // })

        // await clearTable(LUCKY_HONGBAO_CONTRACT, 1, "redpackets", true, PRIVATE_KEY_TEST.split(","))
        // await clearTable(LUCKY_HONGBAO_CONTRACT, 1, "offer", true, PRIVATE_KEY_TEST.split(","))
        
        
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
 * 删除数据
 * @param { string } tokenContract 代币合约用户
 * @param { number } game_id 游戏期数
 * @param { string } table_name 表名
 * @param { boolean } flag 是否删除表中全部数据
 * @param { string[] } privateKeyList 私钥数组
 */
async function clearTable(tokenContract, game_id, table_name, flag, privateKeyList) {
    try {
        // @ts-ignore
        const api = await newApi(privateKeyList);
        let actions = {
            actions: [{
              account: tokenContract,
              name: "clear",
              authorization: [{
                actor: tokenContract,
                permission: 'active',
              }],
              data: {
                key: game_id,
                opt: table_name,
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