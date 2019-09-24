// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "处理用户投注" });
const { Decimal } = require("decimal.js");
const { pool, psTrx, psModifyBalance, psGame, psSnatchOpen } = require("../db");
const { SNATCH_TREASURE_CONTRACT, AGENT_ACCOUNT, UE_TOKEN_SYMBOL, DISTRIBUTION_CENTER_ACCOUNT, PRIVATE_KEY_TEST, UE_TOKEN, BANKER, TBG_WALLET_RECEIVER } = require("../common/constant/eosConstants");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { GAME_STATE } = require("../common/constant/gameConstants.js");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, selectGameSessionByPeriods } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");
const { newApi } = require("./getTrxAction");
/**
 * 处理用户投注
 * @param {{ periods: number, account_name: string, 
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
        logger.debug("oneGameInfo: ", oneGameInfo);
        // 如果找不到，直接返回
        if (!oneGameInfo) {
            return;
        }

        const betAmount = new Decimal(data.bet_amount);
        let currBetAmount = betAmount;
        // 如果直接使用区块链 UE 代币投注，不需要扣除用户的数据库余额
        if (data.pay_type !== UE_TOKEN_SYMBOL) {
            await psModifyBalance.pub({
                game_type: "treasure",
                account_name: data.account_name,
                change_amount: -betAmount.toNumber(),
                pay_type: data.pay_type
            })
        }

        // 90% 拨入全球彩奖池；
        const toPrizePool = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_SNATCH_PRIZE_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1% 拨入 TBG 股东分红池
        // const toTshPool = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1% 拨入 TBG 三倍收益保障池
        // const toProtectionPool = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_PROTECTION_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3% 拨入 TBG 共享推荐佣金分配；
        // const toReferrer = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_REFERRER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3.5% 分发中心收益
        const toDistributionCenter = currBetAmount.mul(ALLOC_CONSTANTS.DISTRIBUTION_CENTER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 1.5% TSH投资股东收益
        // const toTshIncome = currBetAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_TSH_INCOME).div(ALLOC_CONSTANTS.BASE_RATE);
        // 6.5% 转入 TBG 钱包帐号
        const toTgbWallet = currBetAmount.mul(ALLOC_CONSTANTS.TBG_WALLET_RECEIVER).div(ALLOC_CONSTANTS.BASE_RATE);

        // 代投用户
        let extra = { agent_account: "", transaction_id: "", pay_type: data.pay_type }
        if (data.pay_type === UE_TOKEN_SYMBOL) {
            extra.agent_account = data.account_name;
        } else {
            extra.agent_account = AGENT_ACCOUNT;
        }
        
        // 记录投到了第几期
        const SNATCH_BET_PERIODS = `tbg:snatch_treasure:g_id:${ oneGameInfo.g_id }`;
        let periods = await redis.get(SNATCH_BET_PERIODS);
        if (!periods) {
            await redis.set(SNATCH_BET_PERIODS, data.periods);
            periods = `${ data.periods }`;
        }

        // 获取游戏期数详情
        const selectGameSessionSql = `SELECT * FROM game_session WHERE g_id = $1 AND periods = $2`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSessionSql, [ oneGameInfo.g_id, Number(periods) ]);
        logger.debug("gameSessionInfo: ", gameSessionInfo);
        // 如果找不到, 直接返回
        if (!gameSessionInfo) {
            return;
        }

        // 记录某期投了多少个 key
        const SNATCH_BET_KEY = `tbg:snatch_treasure:key_count:${ gameSessionInfo.gs_id }`;
        let totalKeyCount = await redis.get(SNATCH_BET_KEY);
        if (!totalKeyCount) {
            await redis.set(SNATCH_BET_KEY, data.periods);
            totalKeyCount = '0';
        }

        // 如果用户的投注 key 数超过了当前这一期的累记总数,则放到下一期
        let currBetKey = data.bet_key;
        let nextBetKey = 0;
        let nextBetAmount = new Decimal(0);
        let keyCount = Number(totalKeyCount) + data.bet_key;
        let nextData = null;
        if (keyCount > oneGameInfo.key_count) {
             // 多出的这一部分投到下一期
             nextBetKey = keyCount - oneGameInfo.key_count;
             // 补足这一期不足的部分
             currBetKey =  oneGameInfo.key_count - Number(totalKeyCount);
             // 这一期的投注额度
             currBetAmount = currBetAmount.add(currBetKey * oneGameInfo.quantity);
             // 下一期的投注额度
             nextBetAmount = betAmount.minus(currBetKey * oneGameInfo.quantity);
             // 获取下一期游戏期数详情
             const { rows: [ nextGameSessionInfo ] } = await pool.query(selectGameSessionSql, [ oneGameInfo.g_id, Number(periods) + 1  ]);
             // 如果找不到，或者这一期的状态不是开始状态, 不可投注, 直接返回
             if (!nextGameSessionInfo || (!!nextGameSessionInfo && nextGameSessionInfo.game_state !== GAME_STATE.START)) {
                 logger.debug(`${ Number(periods) + 1 } periods game can't not bet`);
                 return;
             }
             await redis.set(`tbg:snatch_treasure:key_count:${ nextGameSessionInfo.gs_id }`, nextBetKey);
             await redis.set(SNATCH_BET_PERIODS, Number(periods) + 1);
             await redis.del(SNATCH_BET_KEY);
             nextData = {
                 "periods": Number(periods) + 1, 
                 "account_name":  data.account_name,
                 "bet_key": nextBetKey, 
                 "bet_amount": nextBetAmount.toNumber(), 
                 "pay_type": data.pay_type, 
                 "g_id": nextGameSessionInfo.g_id
             }
        } else if (keyCount === oneGameInfo.key_count) {
            await redis.set(SNATCH_BET_PERIODS, Number(periods) + 1);
            await redis.del(SNATCH_BET_KEY);
        } else {
            await redis.set(SNATCH_BET_KEY, keyCount);
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
                bet_time: df.format(new Date(), "YYYY-MM-DDTHH:mm:ss"),
                rule: {
                    id: oneGameInfo.g_id,
                    quantity: `${ new Decimal(oneGameInfo.quantity).toFixed(4)} ${ UE_TOKEN_SYMBOL }`,
                    key: oneGameInfo.key_count
                }
            }
        });

        // 分配投注额度
        actList.push({
            account: UE_TOKEN,
            name: "transfer",
            authorization: [{
                actor: AGENT_ACCOUNT,
                permission: 'active',
            }],
            data: {
                from: AGENT_ACCOUNT,
                to: BANKER,
                quantity: `${ toPrizePool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                memo: `user ${ data.account_name } bet ${ new Decimal(oneGameInfo.quantity).toFixed(4)} ${ UE_TOKEN_SYMBOL }, prize add ${ toPrizePool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`
            }
        });

        // 分配投注额度
        actList.push({
            account: UE_TOKEN,
            name: "transfer",
            authorization: [{
                actor: AGENT_ACCOUNT,
                permission: 'active',
            }],
            data: {
                from: AGENT_ACCOUNT,
                to: DISTRIBUTION_CENTER_ACCOUNT,
                quantity: `${ toDistributionCenter.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                memo: `user ${ data.account_name } bet ${ new Decimal(oneGameInfo.quantity).toFixed(4)} ${ UE_TOKEN_SYMBOL }, distribution center add ${ toDistributionCenter.toFixed(4) } ${ UE_TOKEN_SYMBOL }`
            }
        });

        // 转到 tbg 钱包账户
        const memo = {
            "game_name": "treasure",
            "account_name": data.account_name,
            "amount": oneGameInfo.quantity
        }
        actList.push({
            account: UE_TOKEN,
            name: "transfer",
            authorization: [{
                actor: AGENT_ACCOUNT,
                permission: 'active',
            }],
            data: {
                from: AGENT_ACCOUNT,
                to: TBG_WALLET_RECEIVER,
                quantity: `${ toTgbWallet.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                memo: JSON.stringify(memo),
            }
        });

        const privateKeys = PRIVATE_KEY_TEST.split(",");
        const api = await newApi(privateKeys);
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
                betCode, data.bet_key, data.bet_amount, "000000", 0, "now()" 
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
            logger.debug("keyCount: %d, oneGameInfo.key_count: %d", keyCount, oneGameInfo.key_count);
            if (keyCount === oneGameInfo.key_count) {
                await psSnatchOpen.pub({
                    "account_name": data.account_name,
                    "periods": gameSessionInfo.periods,
                    "g_id": gameSessionInfo.g_id,
                    "transaction_id": result.transaction_id
                });
            }
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
        
        // 区块链转账
        psTrx.pub(actList);

        if (!!nextData) {
            // 如果有下一期的投注信息,再执行一次投注
            await handlerBet(nextData);
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
            logger.debug("add lucky code");
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
        logger.debug("add lucky code");
        await redis.sadd(randomKey, randomCode);
    }

    return betCode.join(",")
}

module.exports = handlerBet;