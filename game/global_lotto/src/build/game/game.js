// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ [`@${__filename}`]: "" });
const { generate_primary_key } = require("../../common/");
const { GLOBAL_LOTTO_CONTRACT } = require("../../common/constant/eosConstants");

async function insertGame() {
    try {
        // 如果存在则不再重复插入
        const sql = `
            WITH new_values(g_id, game_name, prize_pool, bottom_pool, reserve_pool, create_time)
                AS (values('${ generate_primary_key() }', '${ GLOBAL_LOTTO_CONTRACT }', 0, 0, 0, now()))
            INSERT INTO game(g_id, game_name, prize_pool, bottom_pool, reserve_pool, create_time)
            SELECT g_id, game_name, prize_pool, bottom_pool, reserve_pool, create_time FROM new_values
                WHERE NOT EXISTS (SELECT 1 FROM game WHERE game.game_name = new_values.game_name);
        `
        // logger.debug("sql: %j", sql);
        const opts = [ generate_primary_key(), GLOBAL_LOTTO_CONTRACT, 0, 0, 0, "now()" ];
        await pool.query(sql);
        logger.info("insert game ok");
    } catch (err) {
        logger.error("insert game error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertGame;