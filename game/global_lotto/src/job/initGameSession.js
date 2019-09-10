// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/initGameSession.js": "初始化游戏期数" });
const { Decimal } = require("decimal.js");
const { pool } = require("../db");
const { GLOBAL_LOTTO_CONTRACT } = require("../common/constant/eosConstants");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, insertGameSession, getLastGameSession } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");

logger.debug(`beginListenAction running...`);
// 每天 0：00 调整价格
// scheduleJob("0 0 0 */1 * *", initGameSession);

initGameSession()

/**
 * 初始化游戏期数
 */
async function initGameSession() {
    try {
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
                    state = 1;
                } else {
                    state = 0;
                }
                
                const data = {
                    "gs_id": generate_primary_key(),
                    "g_id": gameInfo.g_id,
                    "periods": periods,
                    "creator": "",
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
            }
        }

        // const client = await pool.connect();
        // await client.query("BEGIN");
        // try {

        // } catch (err) {
        //     await client.query("ROLLBACK");
        //     throw err;
        // } finally {
        //     await client.release();
        // }
    } catch (err) {
        logger.error("initGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = initGameSession