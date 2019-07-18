// @ts-check
const logger = require("../../common/logger");
const { Decimal } = require("decimal.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js");
const { allocateSurplusAssets } = require("../systemPool");
const { getSystemAccountInfo } = require("../../models/systemPool");
const { getMainAccountBySub } = require("../../models/subAccount/index.js");
const { getStaticSortIncomeByMain } = require("../../models/balanceLog/index.js");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");
const { redis } = require("../../common/index.js");

/**
 * 一行公排收益分配
 * @param { any } client
 * @param { Number } amount 一行公排收益
 * @param { String[] } staticSortList
 */
async function staticSort(client, amount, staticSortList) {
    try {
        // 用户投资时， 一行公排可分配额度
        const sortEnable = new Decimal(amount).mul(INVEST_CONSTANT.SORT_INCOME_RATE / INVEST_CONSTANT.BASE_RATE);
        const len = staticSortList.length;
        logger.debug("staticSortList: ", staticSortList);
        // 前期账号不足分配多出余额
        // 40% 开发 60% 社区
        // 分配收益小于 20UE 的帐号
        if (len <= 5) {
            // todo: 最后五个帐号可均分 amount 的 25%， 其余分给社区，开发
            await handleStaticSort(client, sortEnable, staticSortList, true);
        } else if (len <= 55) {
            // todo:  除去上一个条件的帐号可均分 amount 的 25%， 其余分给社区，开发
            let lastList = staticSortList.splice(-5);
            let preList = staticSortList;
            await handleStaticSort(client, sortEnable, lastList, true);
            await handleStaticSort(client, sortEnable, preList, false);
        } else if (len <= 105) {
            // todo: 除去上两个条件的帐号可均分 amount 的 25%， 其余分给社区，开发
            let lastList = staticSortList.splice(-5);
            let preList = staticSortList.splice(-50);
            let frontList = staticSortList;
            await handleStaticSort(client, sortEnable, lastList, true);
            await handleStaticSort(client, sortEnable, preList, false);
            await handleStaticSort(client, sortEnable, frontList, false);
        } else {
            // 每段都均分 amount 的 25%
            let lastList = staticSortList.splice(-5);
            let preList = staticSortList.splice(-50);
            let frontList = staticSortList.splice(0, 51);
            let other = staticSortList;
            await handleStaticSort(client, sortEnable, lastList, false);
            await handleStaticSort(client, sortEnable, preList, false);
            await handleStaticSort(client, sortEnable, frontList, false);
            await handleStaticSort(client, sortEnable, other, false);
        }
    } catch (err) {
        logger.error("allocating sort income error, the error stock is %O", err);
        throw err;
    }
}

/**
 * 分配一行公排的收益
 * @param { any } client 
 * @param { any } sortEnable 
 * @param { String[] } sortList 
 * @param { Boolean } flag 
 */
async function handleStaticSort(client, sortEnable, sortList, flag) {
    const avg = sortEnable.mul(INCOME_CONSTANT.SORT_INCOME / INCOME_CONSTANT.BASE_RATE).div(sortList.length);
    // 根据子账号查询对应的信息
    const mainAccountList = await getMainAccountBySub(sortList);
    const accountNameList = Array.from(new Set(mainAccountList.map(item => item.main_account)));
    logger.debug("mainAccountList: %O, accountNameList: %O", mainAccountList, accountNameList);
    // 查找主帐户的收益信息
    const mainAccountIncomeInfo = await getStaticSortIncomeByMain(accountNameList);
    logger.debug("mainAccountIncomeInfo: %O", mainAccountIncomeInfo);
    for (let i = 0; i < mainAccountList.length; i++) {
        const mainAccount = mainAccountList[i];
        const mainAccountName = mainAccount.main_account;
        logger.debug("handleStaticSort: ", mainAccount);
        const opType = `sort income`;
        const remark = `subAccount ${ mainAccount.sub_account_name }, income ${ avg.toFixed(8) }`;
        const now = new Date();
        const data = {
            "account_name": mainAccountName,
            "change_amount": avg,
            "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
            "op_type": opType,
            "remark": remark
        }
        // 将获取的收益添加到 redis
        await storeIncome(mainAccountName, "sort", data);
        // 获取加子账号的收益
        const incomeKey = `tbg:subAccountSort:${ mainAccount.sub_account_name }`;
        const subAccountIncome = await redis.get(incomeKey);
        // 继续累加子账号的收益
        const amount = new Decimal(subAccountIncome).add(avg.toFixed(8));            
        // 低于出线额度的用户可分配奖金
        if (amount.lessThan(INCOME_CONSTANT.SORT_OUT_LINE)) {
            await redis.set(incomeKey, amount.toFixed(8));
        } else {
            // 超过出线额度的，从 redis 中清掉
            await redis.del(incomeKey);
        }
    }
    
    if (flag) {
        // 系统账户
        let systemAccount = await getSystemAccountInfo();
        let last = sortEnable.minus(avg);
        await allocateSurplusAssets(client, systemAccount, sortEnable, last, "sort");
    }
}

module.exports = staticSort;