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
const { getGeneralInviteCode, getGlobalInviteCode } = require("../build/inviteCode/genInviteCode");
const { getRandEOSAccount } = require("../build/account/genRandEosAccount");
const { 
    getAccountMemberLevel, getUserSubAccount, 
    updateSubLevel, getReferrer, getAllParentLevel, getStaticSort, getStaticMode, getInvestCode 
} = require("../models/account");
const userInvestment = require("../businessLogic/account/userInvestment.js");
const { 
    getUserBalance, getGroupIncome, getInviteIncome, 
    getStaticModeIncome, getStaticSortIncome, getOtherIncome, getSafeIncome, getBalanceHistory 
} = require("../models/balance");
const accountConstant = require("../common/constant/accountConstant.js");
const { getBingoAmount } = require("../models/systemPool");
const { handlerBingo, handlerHolder, handlerPk, handlerSafe } = require("../businessLogic/systemPool");
const handlerTransfer = require("../job/handlerTransfer.js");
const { scheduleJob } = require("node-schedule");

;(async () => {
    await clearRedisKeyBeforeInit();
    await initCode();
    // await dropAllTable();
    // await createTable();
    // await insertAccount();
    // await insertSystemPool(); 
    await testUserInvestment();
    // await handlerBingo();
    // await handlerHolder();
    // await handlerPk();
    // await handlerSafe();
})();

async function genAccountAndCode(n) {
    try {
        let code = [];
        let account = [];
        for (let i = 0; i < n; i++) {
            const partnerCode = await getGlobalInviteCode();
            code[i] = `W${ partnerCode }`;
            account[i] = getRandEOSAccount();
        }

        return {
            code: code,
            account: account
        }
    } catch (err) {
        console.error("err: ", err);
        throw err;
    }
}

async function clearRedisKeyBeforeInit() {
    await redis.del("tbg:subAccount:position");
    await redis.del("tbg:subAccount:root");
    await redis.del("tbg:level:1");
}

async function testUserInvestment() {
    try {
        let accountName = 'systemwallet';
        let investAmount = 100;
        const remark = `user ${ accountName } invest ${ investAmount } UE`
        let statusCode = await userInvestment(investAmount, accountName, remark);
        console.log("statusCode: ", statusCode); 
    } catch (err) {
        throw err;
    }
}