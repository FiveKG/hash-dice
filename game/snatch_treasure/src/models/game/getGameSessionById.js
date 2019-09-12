// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * 
 * @returns { Promise<DB.Account> }
 */
async function getGameSession() {
    try {
        let sql = `
            SELECT * FROM game_session ORDER BY end_time DESC LIMIT 1;
        `
        let { rows: [ accountInfo ] } = await pool.query(sql);
        return accountInfo;
    } catch (err) {
        logger.error("get account information error, the error stock is %O", err);
        throw err
    }
}

module.exports = getGameSession;