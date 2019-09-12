// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");
const { GAME_STATE } = require("../../common/constant/gameConstants.js");

/**
 * 获取开奖的期数
 * @returns { Promise<DB.GameSession[]> }
 */
async function getRewardGameSession() {
    try {
        let sql = `
            SELECT * FROM game_session WHERE game_state = $1 OR game_state = $2 ORDER BY end_time DESC LIMIT 1;
        `
        let { rows: info } = await pool.query(sql, [ GAME_STATE.AWARDED, GAME_STATE.START ]);
        return info;
    } catch (err) {
        logger.error("get reward game_session information error, the error stock is %O", err);
        throw err
    }
}

module.exports = getRewardGameSession;