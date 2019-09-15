// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "处理用户投注" });
const { Decimal } = require("decimal.js");
const { pool, psTrx, psModifyBalance, psGame } = require("../db");
const { SNATCH_TREASURE_CONTRACT, AGENT_ACCOUNT, UE_TOKEN_SYMBOL, PRIVATE_KEY_TEST } = require("../common/constant/eosConstants");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { GAME_STATE } = require("../common/constant/gameConstants.js");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, selectGameSessionByPeriods } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only

/**
 * 处理用户投注
 * @param {{ periods: number, account_name:  string, 
 * bet_key: number, bet_amount: number, 
 * pay_type: string, g_id: number }} data 
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
        // 所有游戏种类
        const gameInfo = await getGameInfo();
        const oneGameInfo = gameInfo.find(it => it.g_id === data.g_id);
        // 如果找不到，直接返回
        if (!oneGameInfo) {
            return;
        }

        const selectGameSessionSql = `SELECT * FROM game_session WHERE g_id = $1 AND periods = $2`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSessionSql, [ oneGameInfo.g_id, data.periods ]);
        if (!gameSessionInfo || (!!gameSessionInfo && gameSessionInfo.game_state !== GAME_STATE.START)) {
            logger.debug(`${ data.periods } periods game can't not bet`);
            return;
        }
        const betAmount = new Decimal(data.bet_amount);
        // 90% 拨入全球彩奖池；
        const toPrizePool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_SNATCH_PRIZE_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1% 拨入 TBG 股东分红池
        const toTshPool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1% 拨入 TBG 三倍收益保障池
        const toProtectionPool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_PROTECTION_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3% 拨入 TBG 共享推荐佣金分配；
        const toReferrer = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_REFERRER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3.5% 分发中心收益
        const toDistributionCenter = betAmount.mul(ALLOC_CONSTANTS.DISTRIBUTION_CENTER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1.5% TSH投资股东收益
        const toTshIncome = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_INCOME).div(ALLOC_CONSTANTS.BASE_RATE);
         
        // 生成夺宝幸运码
        const baseNum = 100000;
        // 根据用户投注的额度计算出用户可以获得几组幸运码
        // const keyCount = betAmount.div(oneGameInfo.quantity).toNumber();
        // 如果用户的投注 key 数超过了当前这一期的累记总数,则放到下一期
        const betCode = []
        for (let i = 0; i < data.bet_key; i++) {
            const randomNum = Math.ceil(Math.random() * oneGameInfo.key_count);
            betCode.push(randomNum + baseNum);
        }

        let extra = { agent_account: "", transaction_id: "", pay_type: "" }
        if (data.pay_type === UE_TOKEN_SYMBOL) {
            extra.agent_account = data.account_name;
        } else {
            extra.agent_account = AGENT_ACCOUNT;
        }

        // 在数据库中插入投注记录
        const insertBetOrder = `
            INSERT INTO bet_order(bo_id,gs_id,extra,account_name,bet_code,key_count,amount,create_time) 
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `

        // 调用 snatch 合约投注
        actList.push({
            account: SNATCH_TREASURE_CONTRACT,
            name: "bet",
            authorization: [{
                actor: SNATCH_TREASURE_CONTRACT,
                permission: 'active',
            }],
            data: {
                bet_name: data.account_name,
                quantity: `${ betAmount.toFixed(4) } UE`,
                game_id: data.periods,
                bet_time: new Date()
            }
        });

        let flag = false;
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        const privateKeys = PRIVATE_KEY_TEST.split(",");
        const signatureProvider = new JsSignatureProvider(privateKeys);
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            logger.debug("action begin: ", actList);
            const result = await api.transact({ actions: actList }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
            logger.debug("action result: ", result);
            // 获取到投注的 id
            // { transaction_id: "", ... }
            extra.transaction_id = result.transaction_id;
            const opts = [ generate_primary_key(), gameSessionInfo.gs_id, {}, data.account_name, data.bet_key, betCode.join(","), data.bet_amount, "now()" ];
            sqlList.push({
                sql: insertBetOrder,
                values: opts
            });
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values)
            }));
            await client.query("COMMIT");
            flag = true;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        if (flag && actList.length !== 0) {
            await psTrx.pub(actList);
            await psGame.pub({
                account_name: data.account_name,
                bet_amount: betAmount,
                toTshIncome: toTshIncome,
                toProtectionPool: toProtectionPool,
                toReferrer: toReferrer
            });

            // 如果直接使用区块链 UE 代币投注，不需要扣除用户的数据库余额
            if (data.pay_type !== UE_TOKEN_SYMBOL) {
                await psModifyBalance.pub({
                    account_name: data.account_name,
                    change_amount: betAmount,
                    pay_type: data.pay_type
                })
            }
        }
    } catch (err) {
        logger.error("handlerBet error: ", err);
        throw err;
    }
}

module.exports = handlerBet;