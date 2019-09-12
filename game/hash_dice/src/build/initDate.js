// @ts-check
const { pool, createTable } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@initService.js": "initService" });
const { Decimal } = require("decimal.js");

;(async () => {
    // await clearRedisKeyBeforeInit();
    // await dropAllTable();
    // await createTable();
})();