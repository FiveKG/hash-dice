// @ts-check
const { pool, createTable } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@initService.js": "initService" });
const { initCode } = require("./inviteCode/genInviteCode.js");
const { dropAllTable, insertSystemAccount } = require("./systemPool/insertSystemAccount.js");
const insertAssetsPackage = require("./assets/assets.js");
const { redis } = require("../common");
const { OPENING_PRICE, OPENING_PRICE_KEY } = require("../common/constant/tradeConstant.js");
const { 
    SAFE_POOL, SHAREHOLDERS_POOL, SORT_POOL, TBG_FREE_POOL, TBG_JOIN, TBG_MINE_POOL, TBG_TOKEN_COIN, 
    PK_POOL, BINGO_POOL, MODE_POOL, DEV_OP_POOL, COMMUNITY_POOL, TSH_INCOME, PSH_INCOME
} = require("../common/constant/accountConstant.js")
const { Decimal } = require("decimal.js");

;(async () => {
    let systemAccount = [ 
        SAFE_POOL, SHAREHOLDERS_POOL, SORT_POOL, TBG_FREE_POOL, TBG_JOIN, TBG_MINE_POOL, TBG_TOKEN_COIN, 
         PK_POOL, BINGO_POOL, MODE_POOL, DEV_OP_POOL, COMMUNITY_POOL, TSH_INCOME, PSH_INCOME
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