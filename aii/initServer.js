// @ts-check
const { pool, createTable } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@initService.js": "initService" });
const { initCode } = require("../../genInvitationCode.js");
const { dropAllTable, insertAccount, insertSystemPool } = require("./src/test/account/initAccount.js");

;(async () => {
    await initCode();
    // await clearRedisKeyBeforeInit();
    // await dropAllTable();
    await createTable();
    await insertAccount();
    await insertSystemPool(); 
    process.exit(0);
})();

async function clearRedisKeyBeforeInit() {
    await redis.del("subAccount:position");
    await redis.del("subAccount:root");
    await redis.del("tbg:level:1");
}