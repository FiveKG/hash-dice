// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/startGameSession.js": "开始游戏" });
const { Decimal } = require("decimal.js");
const { pool } = require("../db");
const { GLOBAL_LOTTO_CONTRACT } = require("../common/constant/eosConstants");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, insertGameSession, getLastGameSession } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");

logger.debug(`beginListenAction running...`);
// 每小时开一次奖
// scheduleJob("0 0 */1 * * *", startGameSession);

startGameSession()

/**
 * 开始游戏
 */
async function startGameSession() {
    try {
        const startTime = new Date();
        if () {

        }

    } catch (err) {
        logger.error("startGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = startGameSession