// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js");

/**
 * @returns { Promise<DB.Game[]> }
 */
async function getGameInfo() {
    try {
        let sql = `SELECT * FROM game ORDER BY g_id ASC`
        let { rows: gameInfo } = await pool.query(sql);
        return gameInfo;
    } catch (err) {
        logger.error("get game information error, the error stock is %O", err);
        throw err
    }
}

module.exports = getGameInfo;