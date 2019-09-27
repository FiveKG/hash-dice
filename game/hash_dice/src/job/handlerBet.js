// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/handlerBet.js": "hander users' bet" });
const { Decimal } = require("decimal.js");
const { pool, psTrx ,psModifyBalance ,psHashDiceOpen} = require("../db");
const { HASH_DICE_CONTRACT, AGENT_ACCOUNT,BANKER,TBG_WALLET_RECEIVER,UE_TOKEN } = require("../common/constant/eosConstants");
const { END_POINT, PRIVATE_KEY_TEST } = require("../common/constant/eosConstants.js");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");;
const { redis, generate_primary_key } = require("../common");
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const transfer = require("./handlerTransfer")
/**
 * 处理用户投注
 * @param {{ 
 *          account_name:String, 
 *          bet_num: String,
 *          bet_amount: String,
 *          odds_rate:String,
 *          pay_type:String,
 *          agent_account:String
 * }} data 
 */
async function handlerBet(data) {
    try {
        /**
         * 1. 分配投注额度
         * 2. 记录投注信息
         * 3. 投注后修改余额
         * 4. 游戏空投
         */

        const sqlList = [];
        // 记录区块链相关调用信息
        const actList = [];
        const betAmount = new Decimal(data.bet_amount);

        // 0.8% TBG收益
        const toTshIncome = (betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TBG).div(ALLOC_CONSTANTS.BASE_RATE)).toFixed(4);
        // 在数据库中插入投注记录
        const insertBetOrder = `
            INSERT INTO bet_order(id, bet_block_num, reward_block_num,account_name, bet_num, betting_amount, reward,game_rate,agent_account,pay_type,create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11)
        `

        // 调用 hash_dice 合约投注
        actList.push({
            account      : HASH_DICE_CONTRACT,
            name         : "bet",
            authorization: [{
            actor        : HASH_DICE_CONTRACT,
            permission   : 'active',
            }],
            data: {
                bet_name : data.account_name,
                bet_num  : data.bet_num,
                quantity : `${ betAmount.toFixed(4) } UE`,
                odds_rate: data.odds_rate,
                bet_time : new Date()
            }
        });


        // 如果是代投，则需要扣除数据库的余额
        if (data.agent_account === AGENT_ACCOUNT) {
            await psModifyBalance.pub({
                account_name : data.account_name,
                cost_amount  : "-"+data.bet_amount,
                pay_type     : data.pay_type,
                agent_account: AGENT_ACCOUNT
            })
        }
        else{
            data.agent_account = "";
        }


        let flag = false;
        // @ts-ignore
        const privateKeys = PRIVATE_KEY_TEST.split(",");
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        const signatureProvider = new JsSignatureProvider(privateKeys);
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

        
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            logger.debug("action begin: ", actList);
            const result = await api.transact({ actions: actList }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
            // 获取到投注的 id
            // { transaction_id: "", ... }
            const block_num = result.processed.block_num;
            sqlList.push({
                sql: insertBetOrder,
                values: [ generate_primary_key(),block_num,block_num+7, data.account_name, data.bet_num, data.bet_amount,'',data.odds_rate,data.agent_account,data.pay_type,'now()' ]
            });
            await Promise.all(
                sqlList.map(it => {
                    client.query(it.sql, it.values)
                })

            );
            await client.query("COMMIT");
            flag = true;

            //通知开奖
            
            await psHashDiceOpen.pub(block_num+7)
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

       
       
        //按比例分配进TBG里
        if (flag && actList.length !== 0) {
            let memo =`hashdice:${data.account_name}:${betAmount}`;
            let from;
            if(data.agent_account){
                //如果是代投,投注账号发款
                from = AGENT_ACCOUNT;
            }
            else{
                //自己投注，庄家发款
                from = BANKER;
            }
            let transfer_data ={
                "tokenContract"  : UE_TOKEN,
                "from"           : from,
                "to"             : TBG_WALLET_RECEIVER,
                "quantity"       : toTshIncome+" UE",
                "memo"           : memo,
                "privateKeyList" : privateKeys
            }
            psTrx.pub(transfer_data)
        }
    } catch (err) {
        logger.error("handlerBet error: ", err);
        throw err;
    }
}

module.exports = handlerBet;