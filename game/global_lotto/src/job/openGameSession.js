// @ts-check
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "游戏开奖" });
const { Decimal } = require("decimal.js");
const { pool, psTrx } = require("../db");
const { xhr } = require("../common");
const { GLOBAL_LOTTO_CONTRACT } = require("../common/constant/eosConstants");
const { OPEN_CODE_COUNT, GAME_STATE } = require("../common/constant/gameConstants");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const { rpc } = require("./getTrxAction");
const url = require("url");
const df = require("date-fns");
const startGameSession = require("./startGameSession");
const { accReward, getOpenResult } = require("./getOpenResult");
const allocBonus = require("./allocBonus");

/**
 * 游戏开奖
 * @param {{ block_num: number }} data
 */
async function awardGame(data) {
    try {
        const { openCode, openResult } = await getOpenResult(data.block_num);
        const sqlList = [];
        // 记录区块链相关调用信息
        const actList = [];
        const gameInfo = await getGameInfo();
        // 奖池额度
        const prizePool = new Decimal(gameInfo.prize_pool);
        // 统计派奖额度
        let totalAward = new Decimal(0);
        // 派奖后奖池剩余
        let prizePoolSurplus = new Decimal(gameInfo.prize_pool);
        // 派奖后底池剩余
        let bottomPoolSurplus = new Decimal(gameInfo.bottom_pool);
        // 派奖后储备池剩余
        let reservePoolSurplus = new Decimal(gameInfo.reserve_pool);
        // 查找正在开奖的期数
        const rewardingSql = `SELECT * FROM game_session WHERE game_state = $1 ORDER BY reward_time DESC LIMIT 1;`;
        const { rows: [ rewardInfo ] } = await pool.query(rewardingSql, [ GAME_STATE.REWARDING ]);
        logger.debug("rewardInfo: ", rewardInfo);
        if (!rewardInfo) {
            return;
        }
        // 查找这一期所有用户的投注记录
        const betInfoSql = `SELECT * FROM bet_order WHERE gs_id = $1`
        const { rows : betOrderList } = await pool.query(betInfoSql, [ rewardInfo.gs_id ]);
        logger.debug("betOrderList: ", betOrderList);
        const insertRewardSql = `
            INSERT INTO award_session (aw_id, gs_id, extra, account_name, create_time, bet_num, win_key, win_type, one_key_bonus, bonus_amount)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `

        const rewardMap = await accReward(openCode, betOrderList);
        // 是否开出超级全球彩大奖
        let isLotteryAward = false;
        // 遍历用户中奖情况
        for (const [ winCount, bonusAccList ] of rewardMap) {
            if (winCount === ALLOC_CONSTANTS.LOTTERY_AWARD_COUNT) {
                // 超级全球彩大奖
                const winType = "lottery_award"
                const { issued, sqlList: res, tmpActList } = await allocBonus(gameInfo.prize_pool, winCount, bonusAccList, winType, ALLOC_CONSTANTS.LOTTERY_AWARD, insertRewardSql);
                // 将全球彩底池的 50% 拨入下一轮全球彩奖池；
                if (res.length !== 0) {
                    isLotteryAward = true;
                    sqlList.push(...res);
                    totalAward = prizePool.minus(issued);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    bottomPoolSurplus = bottomPoolSurplus.div(2);
                    actList.push(tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.SECOND_PRICE_COUNT) {
                // 二等奖
                const winType = "second_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.SECOND_PRICE, insertRewardSql);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    totalAward = prizePool.minus(issued);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    actList.push(tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.THIRD_PRICE_COUNT) {
                // 三等奖
                const winType = "third_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.THIRD_PRICE, insertRewardSql);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    totalAward = prizePool.minus(issued);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    actList.push(tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.FOURTH_PRICE_COUNT) {
                // 四等奖
                const winType = "fourth_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.FOURTH_PRICE, insertRewardSql);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    totalAward = prizePool.minus(issued);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    actList.push(tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.FIFTH_PRICE_COUNT) {
                // 五等奖
                // 当五、六、七等奖奖金总额奖池不足以支付时，超出部分由全球彩储备池拨出；
                const winType = "fifth_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.FIFTH_PRICE, insertRewardSql);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    totalAward = prizePool.minus(issued);
                    const { pr, is, re } = await minusAllocAmount(prizePoolSurplus, issued, reservePoolSurplus);
                    prizePoolSurplus = pr;
                    reservePoolSurplus = re;
                    actList.push(tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.SIXTH_PRICE_COUNT) {
                // 六等奖
                const winType = "sixth_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.SIXTH_PRICE, insertRewardSql);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    totalAward = prizePool.minus(issued);
                    const { pr, is, re } = await minusAllocAmount(prizePoolSurplus, issued, reservePoolSurplus);
                    prizePoolSurplus = pr;
                    reservePoolSurplus = re;
                    actList.push(tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.SEVENTH_PRICE_COUNT) {
                // 七等奖
                const winType = "seventh_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.LOTTERY_AWARD, insertRewardSql);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    totalAward = prizePool.minus(issued);
                    const { pr, is, re } = await minusAllocAmount(prizePoolSurplus, issued, reservePoolSurplus);
                    prizePoolSurplus = pr;
                    reservePoolSurplus = re;
                    actList.push(tmpActList);
                }
            } else {
                // 未中奖的用户
                const winType = "sorry";
                if (bonusAccList.length !== 0) {
                    // 一个 key 可得的奖金
                    const oneKeyBonus = 0;
                    for (const info of bonusAccList) {
                        const extra = {
                            ...info.extra,
                        }
                        const opts = [
                            generate_primary_key(), info.gs_id, extra, "now()", info.bet_num,
                            winCount, winType, oneKeyBonus, oneKeyBonus
                         ]
                        sqlList.push({ sql: insertRewardSql, values: opts });
                    }
                } 
            }
        }

        if (isLotteryAward) {
            prizePoolSurplus = prizePoolSurplus.add(bottomPoolSurplus);
        }
        // 更新奖池
        const updateGameSql = `
            UPDATE game SET prize_pool = prize_pool + $1, bottom_pool = bottom_pool + $2, reserve_pool = reserve_pool + $3 WHERE g_id = $4;
        `
        sqlList.push({ sql: updateGameSql, values: [ prizePoolSurplus.toNumber(), bottomPoolSurplus.toNumber(), reservePoolSurplus.toNumber(), gameInfo.g_id ] });
        // 更新 session 状态
        const updateSessionSql = `
            UPDATE game_session SET game_state = $1, reward_num = $2, extra = $3 WHERE gs_id = $4;
        `
        // 将当前游戏状态设置为已开奖
        sqlList.push({ sql: updateSessionSql, values: [ GAME_STATE.AWARDED, openCode.join(","), { relate_id: openResult }, rewardInfo.gs_id ] });
        
        const insertPrizePoolLog = `
            INSERT INTO prize_pool_log(gs_id,pool_type,change_amount,current_balance,op_type,extra,remark,create_time) 
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `

        // 添加奖池变动记录
        if (!prizePoolSurplus.minus(gameInfo.prize_pool).eq(0)) {
            sqlList.push({
                sql: insertPrizePoolLog,
                values: [ 
                    rewardInfo.gs_id, 'prize_pool', prizePoolSurplus.minus(gameInfo.prize_pool).toNumber(), prizePoolSurplus.toNumber(), 'award', 
                    { 
                        is_lottery_award: isLotteryAward, 
                        bottom_pool_change: !!isLotteryAward ? bottomPoolSurplus.toNumber() : 0, 
                        reserve_pool_change: reservePoolSurplus.minus(gameInfo.reserve_pool).toNumber() 
                    }, `${ new Date() } award`, "now()" 
                ]
            });
        }
        
        if (!bottomPoolSurplus.minus(gameInfo.bottom_pool).eq(0)) {
            sqlList.push({
                sql: insertPrizePoolLog,
                values: [ rewardInfo.gs_id, 'bottom_pool', bottomPoolSurplus.minus(gameInfo.bottom_pool).toNumber(), 
                    bottomPoolSurplus.toNumber(), 'award', {}, `${ new Date() } award`, "now()" 
                ]
            });
        }

        if (!reservePoolSurplus.minus(gameInfo.reserve_pool).eq(0)) {
            sqlList.push({
                sql: insertPrizePoolLog,
                values: [ rewardInfo.gs_id, 'reserve_pool', reservePoolSurplus.minus(gameInfo.reserve_pool).toNumber(), 
                    reservePoolSurplus.toNumber(), 'award',{}, `${ new Date() } award`, "now()" 
                ]
            });
        }
        
        actList.push({
            account: GLOBAL_LOTTO_CONTRACT,
            name: "setstate",
            authorization: [{
                actor: GLOBAL_LOTTO_CONTRACT,
                permission: 'active',
            }],
            data: {
                game_id: rewardInfo.periods,
                state: GAME_STATE.REWARDING
            }
        });

        // 调用 globallotto 合约开奖，记录相关信息
        actList.push({
            account: GLOBAL_LOTTO_CONTRACT,
            name: "open",
            authorization: [{
                actor: GLOBAL_LOTTO_CONTRACT,
                permission: 'active',
            }],
            data: {
                reward_num: openCode.join(","),
                game_id: rewardInfo.periods,
                reward_time: df.format(rewardInfo.reward_time, "YYYY-MM-DDTHH:mm:ss"),
            }
        });

        logger.debug("sqlList: ", sqlList);
        let flag = false;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            for (const item of sqlList) {
                await client.query(item.sql, item.values);
            }
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
        }
    } catch (err) {
        logger.debug("award err: ", err);
    }
}

/**
 * 扣除分配的额度
 * @param { any } prizePoolSurplus 
 * @param { any } issued 
 * @param { any } reservePoolSurplus 
 */
async function minusAllocAmount(prizePoolSurplus, issued, reservePoolSurplus) {
    // 比较剩余额度和分配的额度，看是否超出奖金池
    if (prizePoolSurplus.lessThan(issued)) {
        // 检查储备池是否足够支付
        if (prizePoolSurplus.add(reservePoolSurplus).lessThan(issued)) {
            // 算出差额
            const diff = issued.minus(prizePoolSurplus);
            // 发放完底池
            prizePoolSurplus = prizePoolSurplus.minus(prizePoolSurplus);
            // 从储备池减去差额
            reservePoolSurplus = reservePoolSurplus.minus(diff);
        } else {
            // todo
            // 余额不足
            prizePoolSurplus = prizePoolSurplus.minus(prizePoolSurplus);
            reservePoolSurplus = reservePoolSurplus.minus(reservePoolSurplus);
        }
    } else {
        prizePoolSurplus = prizePoolSurplus.minus(issued);
    }

    return {
        pr: prizePoolSurplus, 
        is: issued, 
        re: reservePoolSurplus
    }
}

/**
 * 游戏开奖
 * @param {{ block_num: number }} data
 */
async function openGameSession(data) {
    try {
        await startGameSession()
        await awardGame(data);
    } catch (err) {
        logger.error("openGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = openGameSession