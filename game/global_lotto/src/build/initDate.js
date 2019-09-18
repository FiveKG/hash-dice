// @ts-check
const { pool, createTable } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "initService" });
const insertGame = require("./game/game.js");

;(async () => {
    // await createTable.dropAllTable();
    await createTable.createTable();
    await insertGame();
})();