// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/handlerBet.js": "处理用户投注" });
const { Decimal } = require("decimal.js");
const { pool, psGame ,psModifyBalance } = require("../db");
const { HASH_DICE_CONTRACT, AGENT_ACCOUNT } = require("../common/constant/eosConstants");
const { END_POINT, PRIVATE_KEY_TEST } = require("../common/constant/eosConstants.js");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");;
const { redis, generate_primary_key } = require("../common");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { format } = require("date-fns");
const sleep = require("./sleep.js");

/**
 * 处理用户投注
 * @param {{ account_name:string, 
 *          bet_num: string,
 *          bet_amount: number,
 *          odds_rate:string,
 *          pay_type:string,
 *          agent_account:string
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

        // 0.1% 拨入 TBG 股东分红池
        const toTshPool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 0.1% 拨入 TBG 三倍收益保障池
        const toProtectionPool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_PROTECTION_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 0.3% 拨入 TBG 共享推荐佣金分配；
        const toReferrer = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_REFERRER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 0.3% TSH投资股东收益
        const toTshIncome = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_INCOME).div(ALLOC_CONSTANTS.BASE_RATE);
        // 在数据库中插入投注记录
        const insertBetOrder = `
            INSERT INTO bet_order(id, bet_block_num, reward_block_num,account_name, bet_num, betting_amount, reward,game_rate,agent_account,create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
        `

        // 调用 hash_dice 合约投注
        actList.push({
            account: HASH_DICE_CONTRACT,
            name: "bet",
            authorization: [{
                actor: HASH_DICE_CONTRACT,
                permission: 'active',
            }],
            data: {
                bet_name: data.account_name,
                bet_num: data.bet_num,
                quantity: `${ betAmount.toFixed(4) } UE`,
                odds_rate  : data.odds_rate,
                bet_time: new Date()
            }
        });


        // 如果是代投，则需要扣除数据库的余额
        if (data.agent_account === AGENT_ACCOUNT) {
            await psModifyBalance.pub({
                account_name: data.account_name,
                change_amount: data.bet_amount,
                pay_type: data.pay_type
            })
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
                values: [ generate_primary_key(),block_num,block_num+7, data.account_name, data.bet_num, data.bet_amount,'',data.odds_rate,data.agent_account,'now()' ]
            });
            await Promise.all(
                sqlList.map(it => {
                    client.query(it.sql, it.values)
                })

            );
            await client.query("COMMIT");
            flag = true;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        //按比例分配进TBG里
        if (flag && actList.length !== 0) {
            // await psTrx.pub(actList);
            await psGame.pub({
                account_name: data.account_name,
                bet_amount: data.bet_amount,
                toTshIncome: toTshIncome,
                toProtectionPool: toProtectionPool,
                toReferrer: toReferrer,
                toTshPool: toTshPool
            });
        }
    } catch (err) {
        logger.error("handlerBet error: ", err);
        throw err;
    }
}

module.exports = handlerBet;