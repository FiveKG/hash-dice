// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * @param { number } periods
 * @returns { Promise<DB.GameSession> }
 */
async function selectGameSessionByPeriods(periods) {
    try {
        let sql = `
            SELECT * FROM game_session WHERE periods = $1;
        `
        let { rows: [ gameSessionInfo ] } = await pool.query(sql, [ periods ]);
        return gameSessionInfo;
    } catch (err) {
        logger.error("get account information error, the error stock is %O", err);
        throw err
    }
}

module.exports = selectGameSessionByPeriods;