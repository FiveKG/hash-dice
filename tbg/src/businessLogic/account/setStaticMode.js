// @ts-check
const { pool } = require("../../db");
const getAllParentLevel = require("../../models/account/getAllParentLevel.js");
const { insertSubAccount } = require("../../models/subAccount");
const { insertAccountOp } = require("../../models/accountOp")
const logger = require("../../common/logger.js");
const { redis } = require("../../common/index.js");

/**
 * 添加子帐号
 * @param { any } client
 * @param { String } accountName 用户 EOS 帐号
 * @param { String } subAccount 用户子帐号数组
 */
async function setStaticMode(client, accountName, subAccount) {
    try {
        logger.debug("set user static mode");
        let rows = await getAllParentLevel(accountName);
        if (!rows) {
            throw Error("没有推荐关系，请先设置推荐关系，检查数据是否正确");
        }
        let allParentLevel = rows.user_level;
        // 判断最上端的用户是否存在
        let mainId = await pool.query(`select main_id from account where account_name = '${ allParentLevel[1] }'`);
        if (!mainId.rows.length) {
            throw Error("account not found")
        }
        // 查找该用户是否在某个树中，如果不再，重新生成一棵树，用该用户做树的根节点，如果在则继续往原来的树上添加
        let isExists = await pool.query(`select id from sub_account where root_node = '${ allParentLevel[1] }' limit 1`);
        let flag = await redis.sismember("subAccount:root", mainId.rows[0].main_id.toString());
        logger.debug(`mainId: ${ JSON.stringify(mainId) }, isExists: ${ JSON.stringify(isExists) }, flag: ${ flag }`);
        if (!isExists.rows.length && !flag) {
            // 生成新的树
            let obj = {
                id: mainId.rows[0].main_id,
                pid: '0',
                position: 0,
                rootAccount: allParentLevel[1],
                level: 0,
                subAccount: subAccount,
                accountName: accountName
            }
            await redis.sadd("tbg:subAccount:root", mainId.rows[0].main_id);
            await redis.set(`tbg:level:${ mainId.rows[0].main_id }`, 0);
            await insertSubAccount(client, obj);
            await insertAccountOp(client, accountName, "setStaticMode", "初始化三三公排")
        } else {
            let result = await createSubId(mainId.rows[0].main_id);
            let obj = {
                id: result.id,
                pid: result.pid,
                position: result.position,
                rootAccount: allParentLevel[1],
                level: result.level,
                subAccount: subAccount,
                accountName: accountName
            }
            console.debug("obj: ", obj);
            await insertSubAccount(client, obj);
            await insertAccountOp(client, accountName, "setStaticMode", "随机设置三三公排排位")
        }
    } catch (err) {
        throw err
    }
}

/**
 * 获取生成的子帐号表 id, pid, position
 * @param { Number } mainId 
 * @returns { Promise<CreateSubId> }
 */
async function createSubId(mainId) {
    let members = await redis.scard("tbg:subAccount:position");
    let currentMaxLevel = await redis.get(`tbg:level:${ mainId }`);
    let level = parseInt(currentMaxLevel);
    logger.debug(`members: ${ members }`);
    // 如果排满了，下层随机一个位置，否则在当前层没有排满的位置中随机
    if (!members || level === 0) {
        level = level + 1;
        await redis.set(`tbg:level:${ mainId }`, level);
        await genPositionList(level);
    } 
    let position = await redis.spop("tgb:subAccount:position");
    logger.debug(`position: ${ position }`);
    let id = mainId.toString() + level.toString() + position;
    let pid;
    if (level === 1) {
        pid = mainId.toString();
    } else {
        pid = mainId.toString() + (level - 1).toString() + Math.ceil(parseInt(position) / 3).toString();
    }
    return {
        id: id,
        pid: pid,
        position: position,
        level: level
    }
}

/**
 * 生成位置
 * @param { Number } level 
 */
async function genPositionList(level) {
    for (let i = 1; i <= Math.pow(3, level); i++) {
        await redis.sadd("tgb:subAccount:position", i);
    }
}

module.exports = setStaticMode;

/**
 * @description
 * @typedef { Object } CreateSubId
 * @property { String } id
 * @property { String } pid
 * @property { Number } position
 * @property { Number } level
 */