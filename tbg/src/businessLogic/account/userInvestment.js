// @ts-check
const logger = require("../../common/logger.js").child({ "@src/models/account/userInvestment.js": "user investment" });
const { getUserSubAccount } = require("../../models/subAccount");
const allocateInvestAsset = require("./allocateInvestAsset.js");
const calIncome = require("./calIncome.js");
const { redis } = require("../../common/index.js");

/**
 * 用户投资
 * @param { Number } amount 投资额度， decimal 类型
 * @param { String } accountName 用户的帐号
 * @param { String } userInvestmentRemark remark
 */
async function userInvestment(amount, accountName, userInvestmentRemark) {
    try {
        // 生成子账号
        let subAccount = await getUserSubAccount(accountName);
        let lower = 1;
        // 没有子账号，从 1 开始编号
        if (subAccount.length !== 0) {
            lower = subAccount.length + 1;
        }
        const newSubAccount = `${ accountName }-${ lower }`;
        // 生成子账号的同时，给定一个收益的初始值
        await redis.set(`tbg:subAccountSort:${ newSubAccount }`, 0);
        // 分配用户投资额
        await allocateInvestAsset(amount, accountName, newSubAccount, userInvestmentRemark);
        // 开始计算收益
        await calIncome(amount, newSubAccount);
    } catch (err) {
        logger.error("user investment error, the error stock is %O", err);
        throw err;
    }
}

module.exports = userInvestment