// @ts-check
const { readFileSync, writeFileSync, existsSync } = require("fs");
const path = require("path");
const { redis } = require("../../common");
const { INVITE_CODE_KEY } = require("../../common/constant/accountConstant.js");
let invitationCode = null;

/**
 * 生成固定位数的数字码
 * @param { number } min 最小下标
 * @param { number } max 最大上标
 * @returns { Promise<Array<number>> } 生成的乱序的数字码数组
 */
async function genInvitationCode(min, max) {
    let genCode = [];
    for (let i = 0; i <= (max - min); i++) {
        genCode[i] = min + i;
    }

    // let len = genCode.length;
    // for (let i = len - 1; i > 0; i--) {
    //     let m = Math.floor(Math.random() * (i + 1));
    //     let tmp = genCode[i];
    //     genCode[i] = genCode[m];
    //     genCode[m] = tmp;
    // }
    return genCode;
}

/**
 * 将生成的乱序数字码写入文件中
 * @param { number } min 最小下标
 * @param { number } max 最大上标
 */
async function writeCodeToFile(min, max) {
    try {
        let codeFile = path.join(__dirname, "./code.json");
        let isExists = existsSync(codeFile);
        if (!isExists) {
            let genCodeArr = genInvitationCode(min, max);
            writeFileSync(codeFile, JSON.stringify({ "code": genCodeArr }));
            console.log(`end of write file`);
        }
    } catch (err) {
        throw err
    }
}

/**
 * 从文件中读取所有预先生成的号码
 */
async function readCodeFromFile() {
    try {
        let codeFile = path.join(__dirname, "./code.json");
        if (!existsSync(codeFile)) {
            throw Error(`invitationCode file not exists`);
        } else {
            let allCode = readFileSync(codeFile, "utf-8");
            invitationCode = JSON.parse(allCode).code;
        }
    } catch (err) {
        throw err
    }
}

/**
 * 初始化推荐码
 */
async function initCode() {
    // await writeCodeToFile(100000, 999999);
    // await writeCodeToFile(10, 99); // use to test
    // await readCodeFromFile();
    const generalCode = await genInvitationCode(100001, 999999);
    const globalCode = await genInvitationCode(10001, 99999);
    try {
        // 如果没有初始化普通推荐码，初始化一堆
        let isEmptyGeneralCode = await redis.scard(INVITE_CODE_KEY.GENERAL);
        console.debug("isEmptyGeneralCode: ", isEmptyGeneralCode);
        if (!isEmptyGeneralCode) {
            console.debug("add general partner invite code");
            await redis.sadd(INVITE_CODE_KEY.GENERAL, generalCode);
        }

        // 全球合伙人邀请码
        const isEmptyGlobalCode = await redis.scard(INVITE_CODE_KEY.GLOBAL);
        console.debug("isEmptyGlobalCode: ", isEmptyGlobalCode);
        if (!isEmptyGlobalCode) {
            console.debug("add global partner invite code");
            await redis.sadd(INVITE_CODE_KEY.GLOBAL, globalCode);
        }
    } catch (err) {
        throw err;
    }
}

/**
 * 从 redis 里取出一个普通推荐码
 */
async function getGeneralInviteCode() {
    let code = await redis.spop(INVITE_CODE_KEY.GENERAL);
    return code;
}

/**
 * 从 redis 里取出一个合伙人推荐码
 */
async function getGlobalInviteCode() {
    let code = await redis.spop(INVITE_CODE_KEY.GLOBAL);
    return code;
}

module.exports = {
    initCode,
    getGeneralInviteCode,
    getGlobalInviteCode
}