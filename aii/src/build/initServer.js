// @ts-check
const { pool, createTable } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@initService.js": "initService" });
const { initCode } = require("./inviteCode/genInviteCode.js");
const { dropAllTable, insertSystemAccount } = require("./systemPool/insertSystemAccount.js");
const { redis } = require("../common");

;(async () => {
    let systemAccount = [ 
        'safePool',
        'modePool',
        'sortPool',
        'pkPool',
        'bingoPool',
        'shareholdersPool',
        'communityPool',
        'devOpPool'
    ]
    await initCode();
    // await clearRedisKeyBeforeInit();
    // await dropAllTable();
    await createTable();
    await insertSystemAccount(systemAccount); 
    process.exit(0);
})();

// async function clearRedisKeyBeforeInit() {
//     await redis.del("subAccount:position");
//     await redis.del("subAccount:root");
//     await redis.del("tbg:level:1");
// }