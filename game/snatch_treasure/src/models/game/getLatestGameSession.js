// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");
const { GAME_STATE } = require("../../common/constant/gameConstants.js");

/**
 * 获取数据库最新一期 game_session 游戏
 * @param { number } g_id 游戏 id
 * @returns { Promise<DB.GameSession> }
 */
async function getLatestGameSession(g_id) {
    try {
        let sql = `
            SELECT gs.periods, gs.gs_id, game.game_name, game.key_count, game.quantity, gs.game_state
                FROM game_session gs 
                JOIN game ON game.g_id = gs.g_id 
                WHERE gs.g_id = $1 
                AND gs.game_state = $2
                ORDER BY periods ASC 
                LIMIT 1
        `
        let { rows: [ gameSessionInfo ] } = await pool.query(sql, [ g_id, GAME_STATE.START ]);
        return gameSessionInfo;
    } catch (err) {
        logger.error("get last game_session error, the error stock is %O", err);
        throw err
    }
}

module.exports = getLatestGameSession;