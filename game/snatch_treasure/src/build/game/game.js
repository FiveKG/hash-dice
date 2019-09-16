// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@": "assets" });

async function insertGame() {
    try {
        const game = [
            {
                game_name: "夺宝 20x0.1",
                prize_pool: 2,
                key_count: 20,
                quantity: 0.1
            },
            {
                game_name: "夺宝 20x0.5",
                prize_pool: 10,
                key_count: 20,
                quantity: 0.5
            },
            {
                game_name: "夺宝 100x0.1",
                prize_pool: 10,
                key_count: 100,
                quantity: 0.1
            }
        ]
        const valuesStr = game.map(it => {
            return `('${ it.game_name }', ${ it.prize_pool }, ${ it.key_count }, ${ it.quantity })`
        })
        // 如果存在则不再重复插入
        const sql = `
            WITH new_values(game_name, prize_pool, key_count, quantity)
                AS (values ${ valuesStr.join(",") })
            INSERT INTO game(game_name, prize_pool, key_count, quantity)
            SELECT game_name, prize_pool, key_count, quantity FROM new_values
                WHERE NOT EXISTS (SELECT 1 FROM game WHERE game.game_name = new_values.game_name);
        `
        // logger.debug("sql: %j", sql);
        await pool.query(sql);
        logger.info("insert game ok");
    } catch (err) {
        logger.error("insert game error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertGame;