// @ts-check
const { pool, createTable } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@initService.js": "initService" });
const { redis } = require("../common");

;(async () => {
    await createTable();
})();