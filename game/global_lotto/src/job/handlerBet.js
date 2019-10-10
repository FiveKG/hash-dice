// @ts-check
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "处理用户投注" });
const { Decimal } = require("decimal.js");
const { pool, psTrx, psModifyBalance, psGame } = require("../db");
const { 
    GLOBAL_LOTTO_CONTRACT, AGENT_ACCOUNT, UE_TOKEN_SYMBOL, 
    UE_TOKEN, BANKER, TBG_WALLET_RECEIVER, DISTRIBUTION_CENTER_ACCOUNT,
    GLOBAL_LOTTO_BOTTOM_ACCOUNT, GLOBAL_LOTTO_RESERVE_ACCOUNT 
} = require("../common/constant/eosConstants");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { GAME_STATE } = require("../common/constant/gameConstants.js");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, selectGameSessionByPeriods } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");
const { END_POINT, PRIVATE_KEY_TEST } = require("../common/constant/eosConstants.js");
const { newApi } = require("./getTrxAction");
const { format } = require("date-fns");
const sleep = require("./sleep.js");
/**
 * 1. 分配投注额度
 * 2. 记录投注信息
 * 3. 投注后修改余额
 */

/**
 * 处理用户投注
 * @param {{ periods: number, account_name:  string, 
 * bet_num: string, bet_key: number, bet_amount: number, 
 * pay_type: string, bet_type: string }} data 
 */
async function handlerBet(data) {
    try {
        // 先扣除用户的额度，再记录投注信息
        const betAmount = new Decimal(data.bet_amount);
        // 如果直接使用区块链 UE 代币投注，不需要扣除用户的数据库余额
        if (data.pay_type !== UE_TOKEN_SYMBOL) {
            await psModifyBalance.pub({
                game_type: "globallotto",
                account_name: data.account_name,
                change_amount: -betAmount.toNumber(),
                pay_type: data.pay_type
            })
        }
        
        const sqlList = [];
        // 记录区块链相关调用信息
        const actList = [];
        const gameInfo = await getGameInfo();
        const gameSessionInfo = await selectGameSessionByPeriods(data.periods);
        // 80% 拨入全球彩奖池；
        const toPrizePool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_PRIZE_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 5% 拨入全球彩底池
        const toBottomPool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_BOTTOM_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3% 拨入全球彩储备池
        const toReservePool = betAmount.mul(ALLOC_CONSTANTS.ALLOC_TO_RESERVE_POOL).div(ALLOC_CONSTANTS.BASE_RATE);
        // 3.5% 分发中心收益
        const toDistributionCenter = betAmount.mul(ALLOC_CONSTANTS.DISTRIBUTION_CENTER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 8.5% 转入 TBG 钱包帐号
        const toTgbWallet = betAmount.mul(ALLOC_CONSTANTS.TBG_WALLET_RECEIVER).div(ALLOC_CONSTANTS.BASE_RATE);
        // 在数据库中插入投注记录
        const insertBetOrder = `
            INSERT INTO bet_order(bo_id, gs_id, extra, account_name, create_time, bet_num, key_count, amount)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        `
        // 更新奖池
        const updateGameSql = `
            UPDATE game SET prize_pool = prize_pool + $1, bottom_pool = bottom_pool + $2, reserve_pool = reserve_pool + $3 WHERE g_id = $4;
        `
        sqlList.push({ sql: updateGameSql, values: [ toPrizePool.toNumber(), toBottomPool.toNumber(), toReservePool.toNumber(), gameSessionInfo.g_id ] });
        const insertPrizePoolLog = `
            INSERT INTO prize_pool_log(gs_id,pool_type,change_amount,current_balance,op_type,extra,remark,create_time) 
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `

        // 添加奖池变动记录
        sqlList.push({
            sql: insertPrizePoolLog,
            values: [ gameSessionInfo.gs_id, 'prize_pool', toPrizePool.toNumber(), toPrizePool.add(gameInfo.prize_pool).toNumber(), 
                'bet', {}, `user ${ data.account_name } bet ${ data.bet_amount }, prize_pool add ${ toPrizePool }`, "now()" 
            ]
        });

        sqlList.push({
            sql: insertPrizePoolLog,
            values: [ gameSessionInfo.gs_id, 'bottom_pool', toBottomPool.toNumber(), toBottomPool.add(gameInfo.bottom_pool).toNumber(), 
                'bet', {}, `user ${ data.account_name } bet ${ data.bet_amount }, bottom_pool add ${ toBottomPool }`, "now()" 
            ]
        });

        sqlList.push({
            sql: insertPrizePoolLog,
            values: [ gameSessionInfo.gs_id, 'reserve_pool', toReservePool.toNumber(), toReservePool.add(gameInfo.reserve_pool).toNumber(), 
                'bet', {}, `user ${ data.account_name } bet ${ data.bet_amount }, reserve_pool add ${ toReservePool }`, "now()" 
            ]
        });

        // 判断投注的类型
        // let betNum = ''
        // if (data.bet_type === "random") {
        //     const tmp = [];
        //     // 每个 key 生成一组号码
        //     for (let i = 0; i < data.bet_key; i++) {
        //         tmp.push(Math.random().toString().slice(-9).split("").join(","));
        //     }
        //     betNum = tmp.join("|");
        // } else {
        //     betNum = data.bet_num;
        // }

        let extra = { agent_account: "", transaction_id: "", pay_type: data.pay_type }
        let agentAccount = AGENT_ACCOUNT;
        if (data.pay_type === UE_TOKEN_SYMBOL) {
            agentAccount = BANKER
            extra.agent_account = data.account_name;
        } else {
            extra.agent_account = AGENT_ACCOUNT;
            // 分配投注额度
            const toPrizePoolData = {
                from: AGENT_ACCOUNT,
                to: BANKER,
                quantity: `${ toPrizePool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                memo: `user ${ data.account_name } bet ${ betAmount.toFixed(4) } ${ UE_TOKEN_SYMBOL }, prize add ${ toPrizePool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`
            }
            actList.push(setAction(UE_TOKEN, "transfer", AGENT_ACCOUNT, toPrizePoolData));
        }


        // 调用 globallotto 合约投注
        const betData = {
            bet_name: data.account_name,
            bet_num: betNum,
            quantity: `${ betAmount.toFixed(4) } UE`,
            game_id: data.periods,
            bet_time: df.format(new Date(), "YYYY-MM-DDTHH:mm:ss")
        }
        actList.push(setAction(GLOBAL_LOTTO_CONTRACT, "bet", GLOBAL_LOTTO_CONTRACT, betData));

        // 分配给底池
        const toBottomPoolData = {
            from: agentAccount,
            to: GLOBAL_LOTTO_BOTTOM_ACCOUNT,
            quantity: `${ toBottomPool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
            memo: `user ${ data.account_name } bet ${ toBottomPool.toFixed(4) } ${ UE_TOKEN_SYMBOL }, bottom prize add ${ toBottomPool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`
        }
        actList.push(setAction(UE_TOKEN, "transfer", agentAccount, toBottomPoolData));


        // 分配给储备池
        const toReservePoolData = {
            from: agentAccount,
            to: GLOBAL_LOTTO_RESERVE_ACCOUNT,
            quantity: `${ toReservePool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
            memo: `user ${ data.account_name } bet ${ toReservePool.toFixed(4) } ${ UE_TOKEN_SYMBOL }, reserve prize add ${ toReservePool.toFixed(4) } ${ UE_TOKEN_SYMBOL }`
        }
        actList.push(setAction(UE_TOKEN, "transfer", agentAccount, toReservePoolData));

        // 分配投注额度
        const toDistributionCenterData = {
            from: AGENT_ACCOUNT,
            to: DISTRIBUTION_CENTER_ACCOUNT,
            quantity: `${ toDistributionCenter.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
            memo: `user ${ data.account_name } bet ${ betAmount.toFixed(4) } ${ UE_TOKEN_SYMBOL }, distribution center add ${ toDistributionCenter.toFixed(4) } ${ UE_TOKEN_SYMBOL }`
        }
        actList.push(setAction(UE_TOKEN, "transfer", AGENT_ACCOUNT, toDistributionCenterData));

        // 转到 tbg 钱包账户
        const memo = {
            "game_name": "globallotto",
            "account_name": data.account_name,
            "amount": betAmount
        }
        const toTgbWalletData = {
            from: AGENT_ACCOUNT,
            to: TBG_WALLET_RECEIVER,
            quantity: `${ toTgbWallet.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
            memo: JSON.stringify(memo),
        }
        actList.push(setAction(UE_TOKEN, "transfer", AGENT_ACCOUNT, toTgbWalletData));

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
            sqlList.push({
                sql: insertBetOrder,
                values: [ 
                    generate_primary_key(), gameSessionInfo.gs_id, extra, data.account_name, 
                    "now()", betNum, data.bet_key, betAmount.toNumber() 
                ]
            });
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values)
            }));
            logger.debug("sqlList: ", sqlList);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        if (actList.length !== 0) {
            await psTrx.pub(actList);
        }
    } catch (err) {
        logger.error("handlerBet error: ", err);
        throw err;
    }
}

module.exports = handlerBet;

/**
 * 
 * @param { string } account 合约帐号
 * @param { string } name 合约方法名
 * @param { string } actor 用户权限 
 * @param { Object } data 调用参数
 */
function setAction(account, name, actor, data) {
    return {
        account: account,
        name: name,
        authorization: [{
            actor: actor,
            permission: 'active',
        }],
        data: data
    }
}