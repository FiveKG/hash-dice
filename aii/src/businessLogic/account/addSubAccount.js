// @ts-check
const { getUserSubAccount, setReferrer, getStaticSort } = require("../../models/account");
const setStaticMode = require("./setStaticMode.js");
const staticModeIncome = require("./staticModeIncome.js");
const staticSortIncome = require("./staticSortIncome.js");

/**
 * 添加子帐号
 * 投资每满 30 EOS 就生成一个子帐号, 投 300 EOS 生成 10 个子帐号
 * 收益满 30 EOS，自动激活（未激活时），同时生成一个子帐号
 *  @param { any } client 
 * @param { String } accountName 用户的帐号
 * @param { Number } count 子帐号个数
 * @param { Number } amount 投资金额
 */
async function addSubAccount(client, accountName, count, amount) {
    try {
        let subAccount = await getUserSubAccount(accountName);
        let lower = 0;
        if (!subAccount.length) {
            // todo 没有子帐号
            lower = 1;
        } else {
            lower = subAccount.length + 1;
        }
        let upper = lower + count;
        let subAccountList = await createSubAccount(accountName, lower, upper);
        // 三三排位
        for (let i = 0; i < subAccountList.length; i++) {
            await setStaticMode(client, accountName, subAccountList[i]);
            await staticModeIncome(client, amount, subAccountList[i])
        }

        // await redis.del("subAccount:position");
        // 查出所有子帐号， 在最后一个后面继续设置推荐关系
        let allSubLevel = await getStaticSort();
        let flag = allSubLevel.user_level && allSubLevel.user_level.length;
        if (!flag) {
            subAccountList.unshift(accountName);
        } else {
            let len = allSubLevel.user_level.length;
            subAccountList.unshift(allSubLevel.user_level[len - 1]);
        }
        let afterSetRelation = await setRelationship(subAccountList);
        // 一行公排
        for (let i = 0; i < afterSetRelation.length; i ++) {
            let remark = `generate subAccount, set the inviter of ${ afterSetRelation[i].account } to ${ afterSetRelation[i].referrer }`
            await setReferrer(client, afterSetRelation[i].referrer, afterSetRelation[i].account, remark, true);
            await staticSortIncome(client, amount);
        }
    } catch (err) {
        throw err;
    }
}

/**
 * 设置子帐号的推荐关系
 * @param { String[] } subAccountList 
 * @returns { Promise<Object[]> }
 */
async function setRelationship(subAccountList) {
    let relation = [];
    for (let i = 0; i < subAccountList.length - 1; i++) {
        let referrer = subAccountList[i];
        let account = subAccountList[i + 1];
        relation.push({
            referrer: referrer,
            account: account
        });
    }

    return relation;
}

/**
 * 创建子帐号
 * @param { String } accountName 用户的帐号
 * @param { Number } lower 上标
 * @param { Number } upper 下标 边界不包含下标
 * @returns { Promise<String[]> }
 */
async function createSubAccount(accountName, lower, upper) {
    let subAccount = [];
    if (lower > upper) {
        return subAccount
    }
    for (let i = lower; i < upper; i++) {
        let account = `${ accountName }-${ i }`;
        subAccount.push(account);
    }

    return subAccount;
}

module.exports = addSubAccount