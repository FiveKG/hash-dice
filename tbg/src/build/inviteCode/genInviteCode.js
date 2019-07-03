// @ts-check
const { readFileSync, writeFileSync, existsSync } = require("fs");
const path = require("path");
const { redis } = require("../../common");
let invitationCode = null;

/**
 * 生成固定位数的数字码
 * @param { Number } min 最小下标
 * @param { Number } max 最大上标
 * @returns { Promise<Array<Number>> } 生成的乱序的数字码数组
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
 * @param { Number } min 最小下标
 * @param { Number } max 最大上标
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
 * 获取所有号码
 */
function getAllCode() {
    if (!invitationCode) {
        throw Error("invitationCode not init");
    }
    
    return invitationCode;
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
        let isEmptyGeneralCode = await redis.scard("tbg:generalInviteCode");
        console.debug("isEmptyGeneralCode: ", isEmptyGeneralCode);
        if (!isEmptyGeneralCode) {
            await redis.sadd("tbg:generalInviteCode", generalCode);
        }

        // 全球合伙人邀请码
        const isEmptyGlobalCode = await redis.scard("tbg:globalInviteCode");
        console.debug("isEmptyGlobalCode: ", isEmptyGlobalCode);
        if (!isEmptyGlobalCode) {
            await redis.sadd("tbg:globalInviteCode", globalCode);
        }
    } catch (err) {
        throw err;
    }
}

/**
 * 从 redis 里取出一个普通推荐码
 */
async function getGeneralInviteCode() {
    let code = await redis.spop("tbg:generalInviteCode");
    return code;
}

/**
 * 从 redis 里取出一个合伙人推荐码
 */
async function getGlobalInviteCode() {
    let code = await redis.spop("tbg:globalInviteCode");
    return code;
}

module.exports = {
    initCode,
    // getAllCode,
    getGeneralInviteCode,
    getGlobalInviteCode
}