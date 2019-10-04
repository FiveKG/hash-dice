// @ts-check
const { getAccountInfo, getGlobalAccount } = require("../../models/account");
const { insertSubAccount } = require("../../models/subAccount");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "生成子帐号" });
const { redis } = require("../../common/index.js");
const { pool } = require("../../db");
const { ACCOUNT_TYPE } = require("../../common/constant/accountConstant.js");

/**
 * 添加子帐号
 * @param { any } client
 * @param { String } accountName 用户 EOS 帐号
 * @param { String } subAccount 用户子帐号
 * @param { String[] } referrerAccountList 所有父级账号数组
 */
async function addSubAccount(client, accountName, subAccount, referrerAccountList) {
    try {
        logger.debug("set user static mode");
        // 直接投资,参与 tbg2, 且所有推荐人都是普通用户,这些账号都在一个三三公排
        // 先判断推荐关系中有几个全球合伙人，如果有多个，最后一个全球合伙人就是新的三三静态最顶端的用户
        // const accountInfo = await getGlobalAccount(ACCOUNT_TYPE.GLOBAL, referrerAccountList);
        const accountInfo = await getAccountInfo(referrerAccountList[1]);
        const rootAccount = accountInfo.account_name;
        logger.debug("accountInfo: ", accountInfo);
        const levelKey = `tbg:level:${ accountInfo.id }`
        const flag = await redis.get(levelKey);
        if (!flag) {
            const level = 1;
            const position = 1;
            const id = accountInfo.id + "-" + level + position;
            // 生成新的树
            const obj = {
                id: id,
                pid: '0',
                position: position,
                rootAccount: rootAccount,
                level: level,
                subAccount: subAccount,
                accountName: accountName
            }
            // 在 redis 中记录当前这个伞的根节点和层级
            await redis.set(levelKey, 1);
            // 插入子账号
            await insertSubAccount(client, obj);
        } else {
            // 创建子账号信息
            const result = await createSubId(accountInfo.id);
            const obj = {
                id: result.id,
                pid: result.pid,
                position: result.position,
                rootAccount: rootAccount,
                level: result.level,
                subAccount: subAccount,
                accountName: accountName
            }
            logger.debug("obj: ", obj);
            await insertSubAccount(client, obj);
        }
    } catch (err) {
        logger.error(`addSubAccount error, the error stock is %O`, err);
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
    const posKey = `tbg:position:${ mainId }`
    const members = await redis.scard(posKey);
    // 获取当前层级
    const currentMaxLevel = await redis.get(`tbg:level:${ mainId }`);
    let level = parseInt(!currentMaxLevel ? '1' : currentMaxLevel);
    logger.debug("members: %d, level: %d", members, level);
    // 如果排满了，下层随机一个位置，否则在当前层没有排满的位置中随机
    if (!members) {
        level = level + 1;
        await redis.set(`tbg:level:${ mainId }`, level);
        await genPositionList(posKey, level);
    } 
    const position = await redis.spop(posKey);
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
 * @param { string } posKey
 * @param { number } level 
 */
async function genPositionList(posKey, level) {
    const pos = []
    for (let i = 1; i <= Math.pow(3, level - 1); i++) {
        pos.push(i);
    }
    await redis.sadd(posKey, pos);
}

module.exports = addSubAccount;

/**
 * @description
 * @typedef { Object } CreateSubId
 * @property { String } id
 * @property { String } pid
 * @property { number } position
 * @property { number } level
 */