// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * 获取数据库中最后一条 game_session 记录
 * @returns { Promise<DB.GameSession> }
 */
async function getLastGameSession() {
    try {
        let sql = `
            SELECT * FROM game_session ORDER BY end_time DESC LIMIT 1;
        `
        let { rows: [ gameSessionInfo ] } = await pool.query(sql);
        return gameSessionInfo;
    } catch (err) {
        logger.error("get last game_session error, the error stock is %O", err);
        throw err
    }
}

module.exports = getLastGameSession;