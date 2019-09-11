// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/startGameSession.js": "开始游戏" });
const { Decimal } = require("decimal.js");
const { pool } = require("../db");
const { GLOBAL_LOTTO_CONTRACT } = require("../common/constant/eosConstants");
const { GAME_STATE } = require("../common/constant/gameConstants.js");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, insertGameSession, getLastGameSession, updateGameSession, getLatestGameSession } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");


/**
 * 开始新一期游戏
 */
async function startGameSession() {
    try {
        const gameInfo = await getGameInfo();
        const latestGame = await getLatestGameSession();
        if (latestGame.game_state !== GAME_STATE.START) {
            return;
        }
        const sqlList = [];
        const updateSql = `
            UPDATE game_session SET game_state = $1 WHERE gs_id = $2;
        `
        sqlList.push({ sql: updateSql, values: [ GAME_STATE.REWARDING, latestGame.gs_id ] });
        sqlList.push({ sql: `UPDATE game_session SET game_state = $1 WHERE periods = $2`, values: [ GAME_STATE.START, latestGame.periods + 1 ] });
        // 将当前游戏状态设置为开奖中
        // 将下一期游戏设置为可投注
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values)
            }));
            await client.query("ROLLBACK");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        logger.error("startGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = startGameSession