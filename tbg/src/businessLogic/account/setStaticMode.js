// @ts-check
const { pool } = require("../../db");
const { getAllParentLevel, getAccountInfo } = require("../../models/account");
const { insertSubAccount, getSubAccountInfoByRootNode } = require("../../models/subAccount");
const { insertAccountOp } = require("../../models/accountOp")
const logger = require("../../common/logger.js")
const { redis, generate_primary_key } = require("../../common/index.js");

/**
 * 添加三三静态子帐号关系
 * @param { any } client
 * @param { String } accountName 用户 EOS 帐号
 * @param { String } subAccount 用户子帐号数组
 */
async function setStaticMode(client, accountName, subAccount) {
    try {
        logger.debug("set user static mode");
        const allParentLevel = await getAllParentLevel(accountName);
        if (!allParentLevel) {
            throw Error("没有推荐关系，请先设置推荐关系，检查数据是否正确");
        }
        // 判断最上端的用户是否存在
        const accountInfo = await getAccountInfo(allParentLevel[1]);
        if (!accountInfo.account_name) {
            throw Error("account not found");
        }
        // 查找该用户是否在某个树中，如果不在，重新生成一棵树，用该用户做树的根节点，如果在则继续往原来的树上添加
        const subAccountInfo = await getSubAccountInfoByRootNode(allParentLevel[1]);
        const flag = await redis.sismember("tbg:subAccount:root", accountInfo.id);
        logger.debug("allParentLevel: %O, accountInfo: %O", allParentLevel, accountInfo);
        logger.debug("subAccountInfo: %O, flag: %O", subAccountInfo, flag, !subAccountInfo, !flag);
        if (!subAccountInfo && !flag) {
            const level = 1;
            const position = 1;
            const id = accountInfo.id + "-" + level + position;
            // 生成新的树
            const obj = {
                id: id,
                pid: '0',
                position: position,
                rootAccount: allParentLevel[1],
                level: level,
                subAccount: subAccount,
                accountName: accountName
            }
            // 在 redis 中记录当前这个伞的根节点和层级
            await redis.sadd("tbg:subAccount:root", accountInfo.id);
            await redis.set(`tbg:level:${ accountInfo.id }`, 1);
            // 创建第二层的三个位置
            // await genPositionList(level);
            // 插入子账号
            await insertSubAccount(client, obj);
            await insertAccountOp(client, accountName, "setStaticMode", "初始化三三公排")
        } else {
            // 创建子账号信息
            const result = await createSubId(accountInfo.id);
            const obj = {
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
 * 生成的子帐号表 id, pid, position
 * @param { String } mainId 当前这个伞的根节点账号 id
 * @returns { Promise<CreateSubId> }
 */
async function createSubId(mainId) {
    // 获取到剩余位置的数量
    const members = await redis.scard("tbg:subAccount:position");
    // 获取当前层级
    const currentMaxLevel = await redis.get(`tbg:level:${ mainId }`);
    let level = parseInt(currentMaxLevel);
    logger.debug("members: %d, level: %d", members, level);
    // 如果排满了，下层随机一个位置，否则在当前层没有排满的位置中随机
    if (!members) {
        level = level + 1;
        await redis.set(`tbg:level:${ mainId }`, level);
        await genPositionList(level);
    } 
    const position = await redis.spop("tbg:subAccount:position");
    logger.debug("position: %d", position);
    // 子账号表的主键 id， 由根节点账号 id + 中横线 + 层级 + 位置组成
    const id = mainId + "-" + level + position;
    // 子账号表的父 id， 由根节点账号 id + 中横线 + 层级 + 位置
    const pid = mainId + "-" + (level - 1) + Math.ceil(parseInt(position) / 3);
    
    return {
        id: id,
        pid: pid,
        position: position,
        level: level
    }
}

/**
 * 生成位置, 存入 redis，分配位置时, 随机取一个
 * @param { Number } level 
 */
async function genPositionList(level) {
    const pos = []
    for (let i = 1; i <= Math.pow(3, level - 1); i++) {
        pos.push(i);
    }
    await redis.sadd("tbg:subAccount:position", pos);
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