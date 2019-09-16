// @ts-check
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "初始化游戏期数" });
const { Decimal } = require("decimal.js");
const { pool, psTrx } = require("../db");
const { GLOBAL_LOTTO_CONTRACT } = require("../common/constant/eosConstants");
const { GAME_STATE } = require("../common/constant/gameConstants");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, insertGameSession, getLastGameSession } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");

logger.debug(`beginListenAction running...`);
// 每天 0：00 执行一次
scheduleJob("0 0 0 */1 * *", initGameSession);

// initGameSession()

/**
 * 初始化游戏期数
 */
async function initGameSession() {
    try {
        // 记录区块链相关调用信息
        const actList = [];
        const dayInterval = 2;
        const gameInfo = await getGameInfo();
        const lastGameSession = await getLastGameSession();
        let startTime = df.startOfHour(new Date());
        let endTime = df.endOfHour(new Date());
        let lastEndTime = endTime;
        // 游戏期数
        let periods = 1;
        // 游戏状态
        let state = 0;
        if (!!lastGameSession) {
            periods = lastGameSession.periods;
            lastEndTime = lastGameSession.end_time;
        }
        const now = new Date();
        logger.debug("df.differenceInDays(now, lastEndTime):", df.differenceInDays(now, lastEndTime))
        // 如果时间差小于三天，新生成一周的数据
        if (df.differenceInDays(now, lastEndTime) < dayInterval) {
            while (true) {
                if (df.differenceInDays(lastEndTime, now) > dayInterval) {
                    logger.debug("> df.differenceInDays(now, lastEndTime):", df.differenceInDays(lastEndTime, now));
                    break;
                }
                
                if (periods === 1) {
                    state = GAME_STATE.START;
                    // 调用 globallotto 合约设置游戏状态
                    actList.push({
                        account: GLOBAL_LOTTO_CONTRACT,
                        name: "setstate",
                        authorization: [{
                            actor: GLOBAL_LOTTO_CONTRACT,
                            permission: 'active',
                        }],
                        data: {
                            game_id: periods,
                            state: state
                        }
                    });
                } else {
                    state = GAME_STATE.INIT;
                }
                
                const data = {
                    "gs_id": generate_primary_key(),
                    "g_id": gameInfo.g_id,
                    "periods": periods,
                    "creator": GLOBAL_LOTTO_CONTRACT,
                    "start_time": startTime,
                    "end_time": endTime,
                    "reward_time": df.startOfHour(df.addHours(endTime, 1)),
                    "game_state": state,
                    "reward_num": "",
                    "extra": {},
                    "create_time": 'now()',
                }
                await insertGameSession(data);
                endTime = df.addHours(lastEndTime, 1);
                startTime = df.startOfHour(endTime);
                lastEndTime = endTime;
                periods += 1;
                logger.debug("startTime: ", startTime, "endTime: ", endTime, "periods: ", periods, "lastEndTime: ", lastEndTime);

                // 调用 globallotto 合约初始化期数
                actList.push({
                    account: GLOBAL_LOTTO_CONTRACT,
                    name: "init",
                    authorization: [{
                        actor: GLOBAL_LOTTO_CONTRACT,
                        permission: 'active',
                    }],
                    data: {
                        game_id: periods,
                        create_time: startTime,
                        dead_line: endTime,
                    }
                });
            }
        }

        if (actList.length !== 0) {
            await psTrx.pub(actList);
        }
    } catch (err) {
        logger.error("initGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = initGameSession