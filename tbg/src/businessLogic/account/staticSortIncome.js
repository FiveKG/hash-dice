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
        const sortList = staticSortList.splice(2);
        const len = sortList.length;
        logger.debug("sortList: ", sortList);
        // 前期账号不足分配多出余额
        // 40% 开发 60% 社区
        // 分配收益小于 20UE 的帐号
        if (len <= 5) {
            // todo: 最后五个帐号可均分 amount 的 25%， 其余分给社区，开发
            await handleStaticSort(client, sortEnable, sortList, true);
        } else if (len <= 55) {
            // todo:  除去上一个条件的帐号可均分 amount 的 25%， 其余分给社区，开发
            let lastList = sortList.splice(-5);
            let preList = sortList;
            await handleStaticSort(client, sortEnable, lastList, true);
            await handleStaticSort(client, sortEnable, preList, false);
        } else if (len <= 105) {
            // todo: 除去上两个条件的帐号可均分 amount 的 25%， 其余分给社区，开发
            let lastList = sortList.splice(-5);
            let preList = sortList.splice(-50);
            let frontList = sortList;
            await handleStaticSort(client, sortEnable, lastList, true);
            await handleStaticSort(client, sortEnable, preList, false);
            await handleStaticSort(client, sortEnable, frontList, false);
        } else {
            // 每段都均分 amount 的 25%
            let lastList = sortList.splice(-5);
            let preList = sortList.splice(-50);
            let frontList = sortList.splice(0, 51);
            let other = sortList;
            await handleStaticSort(client, sortEnable, lastList, false);
            await handleStaticSort(client, sortEnable, preList, false);
            await handleStaticSort(client, sortEnable, frontList, false);
            await handleStaticSort(client, sortEnable, other, false);
        }

    } catch (err) {
        throw err
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
        // 还没有收益，直接分配，否则要判断是否超过出线额度
        if (!mainAccountIncomeInfo) {
            const now = new Date();
            const data = {
                "account_name": mainAccountName,
                "change_amount": avg,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": opType,
                "remark": remark
            }
            await storeIncome(mainAccountName, "sort", data);
        } else {
            const balanceInfo = mainAccountIncomeInfo.find(item => item.account_name === mainAccountName);
            const amount = new Decimal(balanceInfo.amount);
            // 低于出线额度的用户可分配奖金
            if (amount.lessThan(INCOME_CONSTANT.SORT_OUT_LINE)) {
                const now = new Date();
                const data = {
                    "account_name": mainAccountName,
                    "change_amount": avg,
                    "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                    "op_type": opType,
                    "remark": remark
                }
                await storeIncome(mainAccountName, "sort", data);
            }
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