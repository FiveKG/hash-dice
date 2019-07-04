// @ts-check
const { getUserSubAccount, getStaticSort, updateReferCount } = require("../../models/account");
const logger = require("../../common/logger");
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

        // 一行公排的所有帐号, 查出所有子帐号， 在最后一个后面继续设置推荐关系
        let staticSort = await getStaticSort();
        logger.debug("staticSort: ", staticSort, !staticSort);
        let referrer = ``;
        if (!staticSort) {
            referrer = accountName;
        } else {
            let len = staticSort.user_level.length;
            referrer = staticSort.user_level[len - 1];
        }
        // 一行公排
        let remark = `generate sub-account, set the inviter of ${ newSubAccount } to ${ referrer }`
        await insertReferrer(client, referrer, newSubAccount);
        // 生成子账号，不需要更新推荐的人数
        // await updateReferCount(client, referrer);
        await insertAccountOp(client, newSubAccount, "generate sub-account", remark)
        const flag = !staticSort || !staticSort.user_level || staticSort.user_level.length < 2;
        if (flag) {
            return;
        }
        await staticSortIncome(client, amount, staticSort.user_level);
    } catch (err) {
        logger.error("add sub-account error, the error stock is %O", err);
        throw err;
    }
}

module.exports = addSubAccount