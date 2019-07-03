// @ts-check
const { getUserSubAccount, getStaticSort, updateReferCount } = require("../../models/account");
const { insertReferrer } = require("../../models/referrer");
const { insertAccountOp } = require("../../models/accountOp")
const setStaticMode = require("./setStaticMode.js");
const staticModeIncome = require("./staticModeIncome.js");
const staticSortIncome = require("./staticSortIncome.js");

/**
 * 添加子帐号
 * 投资每满 100 UE 就生成一个子帐号
 * 收益满 100 UE，自动激活（未激活时），同时生成一个子帐号
 * @param { any } client 
 * @param { String } accountName 用户的帐号
 * @param { Number } amount 投资金额
 */
async function addSubAccount(client, accountName, amount) {
    try {
        let subAccount = await getUserSubAccount(accountName);
        let lower = 0;
        if (subAccount.length === 0) {
            // todo 没有子帐号
            lower = 1;
        } else {
            lower = subAccount.length + 1;
        }
        const newSubAccount = `${ accountName }-${ lower }`
        // 三三排位
        await setStaticMode(client, accountName, newSubAccount);
        await staticModeIncome(client, amount, newSubAccount)

        // 查出所有子帐号， 在最后一个后面继续设置推荐关系
        let allSubLevel = await getStaticSort();
        let flag = allSubLevel.user_level && allSubLevel.user_level.length === 0;
        let referrer = ``;
        if (!flag) {
            referrer = accountName;
        } else {
            let len = allSubLevel.user_level.length;
            referrer = allSubLevel.user_level[len - 1];
        }
        // 一行公排
        let remark = `generate sub-account, set the inviter of ${ newSubAccount } to ${ referrer }`
        await insertReferrer(client, referrer, newSubAccount);
        await updateReferCount(client, referrer);
        await insertAccountOp(client, newSubAccount, "generate sub-account", remark)
        await staticSortIncome(client, amount);
    } catch (err) {
        console.error("add sub-account error, the error stock is %O", err);
        throw err;
    }
}

module.exports = addSubAccount