// @ts-check
const { readFileSync, writeFileSync, existsSync, createWriteStream, writeFile, write, open, appendFile, close } = require("fs");
const path = require("path")
const { pool, createTable } = require("../db/index.js");
const { redis } = require("../common/index.js");
const storeIncome = require("../common/storeIncome.js");
const logger = require("../common/logger.js").child({ "@src/test/test.js": "test" });
const { initCode } = require("../build/inviteCode/genInviteCode.js");
const uuidv4 = require("uuid/v4");
const df = require("date-fns");
const { Decimal } = require("decimal.js");
const { dropAllTable, insertAccount, insertSystemPool } = require("./account/initAccount.js");
const { 
    getAccountMemberLevel, getUserSubAccount, 
    updateSubLevel, getReferrer, getAllParentLevel, getStaticSort, getStaticMode, getInvestCode 
} = require("../models/account");
const userInvestment = require("../businessLogic/account/userInvestment.js");
const { 
    getUserBalance, getGroupIncome, getInviteIncome, 
    getStaticModeIncome, getStaticSortIncome, getOtherIncome, getSafeIncome, getBalanceHistory 
} = require("../models/balance");
const rateConstant = require("../common/constant/rateConstant.js")
const accountConstant = require("../common/constant/accountConstant.js");
const { getBingoAmount } = require("../models/systemPool");
const { handlerBingo, handlerHolder, handlerPk, handlerSafe } = require("../businessLogic/systemPool");
const handlerTransfer = require("../job/handlerTransfer.js");
const { scheduleJob } = require("node-schedule");

;(async () => {
    // await initCode();
    // await clearRedisKeyBeforeInit();
    // await dropAllTable();
    // await createTable();
    // await insertAccount();
    // await insertSystemPool(); 
    // await testUserInvestment();
    // await testStaticSort();
    // await handlerBingo();
    // await handlerHolder();
    // await handlerPk();
    // await handlerSafe();
    // await testStaticMode("yujinsheng11");
    await firstAccount("yujinsheng11");
    // process.exit(0);
})();

async function printHaha() {
    let now = new Date();
    console.log(now);
    console.log("haha");
}

async function firstAccount(accountName) {
    try {
        let selectAccountNameSql = `select account_name from account where account_name not in ('${ accountName }') order by random() limit 1;`
        let { rows } = await pool.query(selectAccountNameSql);
        console.log(rows);
    } catch (err) {
        throw err;
    }
}

async function clearRedisKeyBeforeInit() {
    await redis.del("subAccount:position");
    await redis.del("subAccount:root");
    await redis.del("tbg:level:1");
}

// async function testUserInvestment() {
//     try {
//         let accountName = 'systemwallet';
//         accountName = "ymnwinta42oz"
//         let investAmount = 30;
//         let statusCode = await userInvestment(investAmount, accountName);
//         console.log("statusCode: ", statusCode); 
//     } catch (err) {
//         throw err;
//     }
// }