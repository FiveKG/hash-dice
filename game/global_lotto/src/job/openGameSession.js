// @ts-check
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "游戏开奖" });
const { Decimal } = require("decimal.js");
const { pool, psTrx, psModifyBalance } = require("../db");
const { xhr } = require("../common");
const { GLOBAL_LOTTO_CONTRACT } = require("../common/constant/eosConstants");
const { OPEN_CODE_COUNT, GAME_STATE } = require("../common/constant/gameConstants");
const { getGameInfo } = require("../models/game");
const df = require("date-fns");
const startGameSession = require("./startGameSession");
const { accReward, getOpenResult } = require("./getOpenResult");
const handleOpenResult = require("./allocBonus");

/**
 * 游戏开奖
 * @param {{ block_num: number }} data
 */
async function awardGame(data) {
    try {
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
        // 获取开奖码和开奖结果
        const { openCode, openResult } = await getOpenResult(data.block_num);
        // 获取游戏奖池信息
        const gameInfo = await getGameInfo();
        // 计算和分配开奖结果
        const rewardMap = await accReward(openCode, betOrderList);
        logger.debug("rewardMap: ", rewardMap);
        let { 
            prizePoolSurplus, bottomPoolSurplus, reservePoolSurplus, 
            isLotteryAward, actList, sqlList, bonusMap
        } = await handleOpenResult(gameInfo, rewardMap);

        // 是否开出超级全球彩大奖
        if (isLotteryAward) {
            prizePoolSurplus = prizePoolSurplus.add(bottomPoolSurplus);
        }
        // 更新奖池
        const updateGameSql = `UPDATE game SET prize_pool = $1, bottom_pool = $2, reserve_pool = $3 WHERE g_id = $4;`
        const opts = [ prizePoolSurplus.toNumber(), bottomPoolSurplus.toNumber(), reservePoolSurplus.toNumber(), gameInfo.g_id ];
        sqlList.push({ sql: updateGameSql, values: opts });
        // 更新 session 状态
        const updateSessionSql = `UPDATE game_session SET game_state = $1, reward_num = $2, extra = $3 WHERE gs_id = $4;`
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

        // 调用 globallotto 合约开奖，记录相关信息
        const openData = {
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
        }
        // @ts-ignore
        actList.push(openData);

        logger.debug("sqlList: ", sqlList);
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            for (const item of sqlList) {
                await client.query(item.sql, item.values);
            }
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

        // 开奖后统一退还投注额度
        for (const [ key, val ] of bonusMap) {
            await psModifyBalance.pub({
                game_type: "globallotto",
                account_name: key,
                change_amount: val.change_amount,
                pay_type: val.pay_type
            });
        }
    } catch (err) {
        logger.debug("award err: ", err);
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