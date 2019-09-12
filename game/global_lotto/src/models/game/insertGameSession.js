// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * @param { DB.GameSession } data 
 */
async function insertGameSession(data) {
    try {
        let sql = `
            INSERT INTO game_session (gs_id, g_id, creator, periods, start_time, end_time, reward_time, game_state, reward_num, create_time, extra)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `
        const opts = [ 
            data.gs_id, data.g_id, data.creator, data.periods, 
            data.start_time, data.end_time, data.reward_time, data.game_state, 
            data.reward_num, data.create_time, data.extra ]
        await pool.query(sql, opts);
    } catch (err) {
        logger.error("insert into game_session error, the error stock is %O", err);
        throw err
    }
}

module.exports = insertGameSession;