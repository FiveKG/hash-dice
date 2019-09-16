// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "处理用户投注" });
const { Decimal } = require("decimal.js");
const { pool, psTrx, psModifyBalance, psGame, psSnatchOpen } = require("../db");
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

        // 获取游戏期数详情
        const selectGameSessionSql = `SELECT * FROM game_session WHERE g_id = $1 AND periods = $2`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSessionSql, [ oneGameInfo.g_id, data.periods ]);
        // 如果找不到，或者这一期的状态不是开始状态, 不可投注, 直接返回
        if (!gameSessionInfo || (!!gameSessionInfo && gameSessionInfo.game_state !== GAME_STATE.START)) {
            logger.debug(`${ data.periods } periods game can't not bet`);
            return;
        }

        // 根据用户投注的额度计算出用户可以获得几组幸运码
        // const keyCount = betAmount.div(oneGameInfo.quantity).toNumber();
        // 查找这一期的投注记录
        const selectBetOrder = `SELECT * FROM bet_order WHERE gs_id = $1`
        const { rows: betOrderList } = await pool.query(selectBetOrder, [ gameSessionInfo.gs_id ]);
        let totalKeyCount = 0;
        // 累加这一期投注的 key 的数量
        if (betOrderList.length !== 0) {
            totalKeyCount = betOrderList.map(it => it.key_count).reduce((pre, curr) => pre + curr);
        };

        // 如果用户的投注 key 数超过了当前这一期的累记总数,则放到下一期
        let currBetKey = data.bet_key;
        let nextBetKey = 0;
        const betAmount = new Decimal(data.bet_amount);
        let currBetAmount = new Decimal(0);
        let nextBetAmount = new Decimal(0);
        let keyCount = totalKeyCount + data.bet_key;
        let nextData = null;
        if (keyCount > oneGameInfo.key_count) {
            // 多出的这一部分投到下一期
            nextBetKey = keyCount - oneGameInfo.key_count;
            // 补足这一期不足的部分
            currBetKey =  oneGameInfo.key_count - totalKeyCount;
            // 这一期的投注额度
            currBetAmount = currBetAmount.add(currBetKey * oneGameInfo.quantity);
            // 下一期的投注额度
            nextBetAmount = betAmount.minus(currBetKey * oneGameInfo.quantity);

            // 获取下一期游戏期数详情
            const selectGameSessionSql = `SELECT * FROM game_session WHERE periods = $2`
            const { rows: [ nextGameSessionInfo ] } = await pool.query(selectGameSessionSql, [ data.periods + 1 ]);
            // 如果找不到，或者这一期的状态不是开始状态, 不可投注, 直接返回
            if (!nextGameSessionInfo || (!!nextGameSessionInfo && nextGameSessionInfo.game_state !== GAME_STATE.START)) {
                logger.debug(`${ data.periods + 1 } periods game can't not bet`);
                return;
            }
            nextData = {
                "periods": data.periods + 1, 
                "account_name":  data.account_name,
                "bet_key": nextBetKey, 
                "bet_amount": nextBetAmount.toNumber(), 
                "pay_type": data.pay_type, 
                "g_id": nextGameSessionInfo.g_id
            }
        }
        
        // 90% 拨入全球彩奖池；
        const toPrizePool = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_SNATCH_PRIZE_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1% 拨入 TBG 股东分红池
        const toTshPool = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1% 拨入 TBG 三倍收益保障池
        const toProtectionPool = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_PROTECTION_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3% 拨入 TBG 共享推荐佣金分配；
        const toReferrer = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_REFERRER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3.5% 分发中心收益
        const toDistributionCenter = currBetAmount.mul(ALLOC_CONSTANTS.DISTRIBUTION_CENTER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1.5% TSH投资股东收益
        const toTshIncome = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_INCOME).div(ALLOC_CONSTANTS.BASE_RATE);

        // 代投用户
        let extra = { agent_account: "", transaction_id: "", pay_type: "" }
        if (data.pay_type === UE_TOKEN_SYMBOL) {
            extra.agent_account = data.account_name;
        } else {
            extra.agent_account = AGENT_ACCOUNT;
        }

        // 当前这一期的投注幸运码
        const randomKey = `tbg:snatch_treasure:lucky_code:${data.g_id}`;
        const betCode = await genBetCode(currBetKey, oneGameInfo.key_count, randomKey);

        // 在数据库中插入投注记录
        const insertBetOrder = `
            INSERT INTO bet_order(bo_id,gs_id,extra,account_name,bet_code,key_count,amount,bonus_code,bonus_amount,create_time) 
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
                snatch_code: betCode, 
                key: data.bet_key,
                quantity: `${ currBetAmount.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                game_id: data.periods,
                bet_time: new Date(),
                rule: {
                    id: oneGameInfo.g_id,
                    quantity: oneGameInfo.quantity,
                    key: oneGameInfo.key_count
                }
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
            const opts = [ 
                generate_primary_key(), gameSessionInfo.gs_id, extra, data.account_name, 
                betCode, data.bet_key, 0, 0, data.bet_amount, "now()" 
            ];
            sqlList.push({
                sql: insertBetOrder,
                values: opts
            });
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values)
            }));
            await client.query("COMMIT");
            // 如果投注的 key 刚好投满,那么最后这一注作为开奖 id
            if (keyCount > oneGameInfo.key_count) {
                await psSnatchOpen.pub({
                    "periods": data.periods,
                    "g_id": gameSessionInfo.g_id,
                    "transaction_id": result.transaction_id
                });
            }
            flag = true;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        // 如果有下一期的投注信息,再执行一次投注
        if (!!nextData) {
            await handlerBet(nextData);
        }

        if (flag && actList.length !== 0) {
            await psTrx.pub(actList);
            await psGame.pub({
                account_name: data.account_name,
                bet_amount: currBetAmount,
                toTshIncome: toTshIncome,
                toTshPool: toTshPool,
                toProtectionPool: toProtectionPool,
                toReferrer: toReferrer
            });

            // 如果直接使用区块链 UE 代币投注，不需要扣除用户的数据库余额
            if (data.pay_type !== UE_TOKEN_SYMBOL) {
                await psModifyBalance.pub({
                    account_name: data.account_name,
                    change_amount: currBetAmount,
                    pay_type: data.pay_type
                })
            }
        }
    } catch (err) {
        logger.error("handlerBet error: ", err);
        throw err;
    }
}

/**
 *  生成投注幸运码
 * @param { number } betKey 投注 key 的数量
 * @param { number } keyCount 总的 key 的数量
 * @param { string } randomKey redis key 值
 * @returns { Promise<string> }
 */
async function genBetCode(betKey, keyCount, randomKey) {
    // 生成夺宝幸运码
    const baseNum = 100000;
    const betCode = [];
    // 生成的随机幸运码不重复, 每期只能有一位用户中奖
    for (let i = 0; i < betKey; i++) {
        let randomNum = await redis.spop(randomKey);
        // 如果取不到, 先生成一期
        if (!randomNum) {
            const randomCode = []
            for (let i = 1; i <= keyCount; i++) {
                randomCode.push(baseNum + i);
            }
            console.debug("add general partner invite code");
            await redis.sadd(randomKey, randomCode);
            randomNum = await redis.spop(randomKey);
        }
        // const randomNum = Math.ceil(Math.random() * keyCount);
        betCode.push(randomNum);
    }

    // 如果用完了,重新生成一期
    let isEmptyCode = await redis.scard(randomKey);
    if (!isEmptyCode) {
        const randomCode = []
        for (let i = 1; i <= keyCount; i++) {
            randomCode.push(baseNum + i);
        }
        console.debug("add general partner invite code");
        await redis.sadd(randomKey, randomCode);
    }

    return betCode.join(",")
}

module.exports = handlerBet;