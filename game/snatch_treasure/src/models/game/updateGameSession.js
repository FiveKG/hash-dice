// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * @param { DB.GameSession } data 
 */
async function updateGameSession(data) {
    try {
        const setStr = [];
        const whereStr = [];
        const values = [];

        if (!!data.reward_num) {
            values.push(data.reward_num);
            setStr.push(`reward_num = $${ values.length }`);
        }

        if (!!data.game_state) {
            values.push(data.game_state);
            setStr.push(`game_state = $${ values.length }`);
        }

        if (!!data.start_time) {
            values.push(data.start_time);
            setStr.push(`start_time = $${ values.length }`);
        }

        if (!!data.end_time) {
            values.push(data.end_time);
            setStr.push(`end_time = $${ values.length }`);
        }

        if (setStr.length !== 0) {
            values.push(data.gs_id);
            whereStr.push(`gs_id = $${ values.length }`)
        }

        let sql = `
            UPDATE game_session 
                SET ${ setStr.join(",") }
                WHERE ${ whereStr.join(",") }
        `
        await pool.query(sql, values);
    } catch (err) {
        logger.error("update game_session error, the error stock is %O", err);
        throw err
    }
}

module.exports = updateGameSession;