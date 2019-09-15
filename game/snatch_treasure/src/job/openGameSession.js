// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/openGameSession.js": "游戏开奖" });
const { Decimal } = require("decimal.js");
const { pool, psTrx } = require("../db");
const { xhr } = require("../common");
const { SNATCH_TREASURE_CONTRACT } = require("../common/constant/eosConstants");
const { OPEN_CODE_COUNT, GAME_STATE } = require("../common/constant/gameConstants");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const { rpc } = require("./getTrxAction");
const url = require("url");
const df = require("date-fns");
const { initGameSession } = require("./initGameSession");
const { accReward, getOpenResult } = require("./getOpenResult");
const allocBonus = require("./allocBonus");

/**
 * 游戏开奖
 * @param {{ block_num: number }} data
 */
async function openGameSession(data) {
    try {
        const { openCode, openResult } = await getOpenResult(data.block_num);
        const sqlList = [];
        // 记录区块链相关调用信息
        const actList = [];
        const gameInfo = await getGameInfo();
        // 查找正在开奖的期数
        const rewardingSql = `SELECT * FROM game_session WHERE game_state = $1;`;
        const { rows: [ rewardInfo ] } = await pool.query(rewardingSql, [ GAME_STATE.REWARDING ]);
        if (!rewardInfo) {
            return;
        }
        // 查找这一期所有用户的投注记录
        const betInfoSql = `SELECT * FROM bet_order WHERE gs_id = $1`
        const { rows : betOrderList } = await pool.query(betInfoSql, [ rewardInfo.gs_id ]);
        
        const insertRewardSql = `
            INSERT INTO award_session (aw_id, gs_id, extra, account_name, create_time, bet_num, win_key, win_type, one_key_bonus, bonus_amount)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `

        const rewardMap = await accReward(openCode, betOrderList);
        // 是否开出超级全球彩大奖
        let isLotteryAward = false;
        // 遍历用户中奖情况
        for (const [ winCount, bonusAccList ] of rewardMap) {
            
        }

        
        // 更新 session 状态
        const updateSessionSql = `
            UPDATE game_session SET game_state = $1, reward_num = $2, extra = $3 WHERE gs_id = $4;
        `
        // 将当前游戏状态设置为已开奖
        sqlList.push({ sql: updateSessionSql, values: [ GAME_STATE.AWARDED, openCode.join(","), { relate_id: openResult }, rewardInfo.gs_id ] });
        

        // 调用 globallotto 合约开奖，记录相关信息
        actList.push({
            account: SNATCH_TREASURE_CONTRACT,
            name: "open",
            authorization: [{
                actor: SNATCH_TREASURE_CONTRACT,
                permission: 'active',
            }],
            data: {
                reward_num: openCode.join(","),
                game_id: rewardInfo.periods,
                reward_time: rewardInfo.reward_time,
            }
        });

        let flag = false;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
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
        }

        // 每次都调用一下初始化
        await initGameSession(data.g_id, data.periods);
    } catch (err) {
        logger.debug("award err: ", err);
    }
}


module.exports = openGameSession