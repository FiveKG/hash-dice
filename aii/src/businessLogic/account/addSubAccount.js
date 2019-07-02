// @ts-check
const { getUserSubAccount, getStaticSort, updateReferCount } = require("../../models/account");
const { insertReferrer } = require("../../models/referrer");
const { insertAccountOp } = require("../../models/accountOp")
const setStaticMode = require("./setStaticMode.js");
const staticModeIncome = require("./staticModeIncome.js");
const staticSortIncome = require("./staticSortIncome.js");

/**
 * 添加子帐号
 * 投资每满 30 UE 就生成一个子帐号
 * 收益满 30 UE，自动激活（未激活时），同时生成一个子帐号
 * @param { any } client 
 * @param { String } accountName 用户的帐号
 * @param { Number } amount 投资金额
 */
async function addSubAccount(client, accountName, amount) {
    try {
        let subAccount = await getUserSubAccount(accountName);
        let lower = 0;
        if (!subAccount.length) {
            // todo 没有子帐号
            lower = 1;
        } else {
            lower = subAccount.length + 1;
        }
        let upper = lower + 1;
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
            // await setReferrer(client, afterSetRelation[i].referrer, afterSetRelation[i].account, remark, true);
            await insertReferrer(client, afterSetRelation[i].referrer, afterSetRelation[i].account);
            await updateReferCount(client, afterSetRelation[i].referrer);
            await insertAccountOp(client, afterSetRelation[i].account, "bind referrer", remark)
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