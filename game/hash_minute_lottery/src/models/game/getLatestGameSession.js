// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");
const { GAME_STATE } = require("../../common/constant/gameConstants.js");

/**
 * 获取数据库最新一期 game_session 游戏
 * @returns { Promise<DB.GameSession> }
 */
async function getLatestGameSession() {
    try {
        let sql = `
            SELECT * FROM game_session WHERE game_state = $1;
        `
        let { rows: [ gameSessionInfo ] } = await pool.query(sql, [ GAME_STATE.START ]);
        return gameSessionInfo;
    } catch (err) {
        logger.error("get last game_session error, the error stock is %O", err);
        throw err
    }
}

module.exports = getLatestGameSession;