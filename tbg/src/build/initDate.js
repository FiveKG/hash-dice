// @ts-check
const { pool, createTable } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@initService.js": "initService" });
const { initCode } = require("./inviteCode/genInviteCode.js");
const { dropAllTable, insertSystemAccount } = require("./systemPool/insertSystemAccount.js");
const insertAssetsPackage = require("./assets/assets.js");
const { redis } = require("../common");
const { OPENING_PRICE, OPENING_PRICE_KEY } = require("../common/constant/tradeConstant.js");
const { Decimal } = require("decimal.js");

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
    await insertAssetsPackage();
    await initOpeningPrice();
})();

// async function clearRedisKeyBeforeInit() {
//     await redis.del("subAccount:position");
//     await redis.del("subAccount:root");
//     await redis.del("tbg:level:1");
// }

async function initOpeningPrice() {
    try {
        const exist = await redis.get(OPENING_PRICE_KEY);
        if (!exist) {
            await redis.set(OPENING_PRICE_KEY, new Decimal(OPENING_PRICE).toFixed(8));
        }
    } catch (err) {
        logger.error("init TBG opening price error, the error stock is %O", err);
        throw err;
    }
}