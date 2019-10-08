// @ts-check
const logger = require("../../common/logger").child({ [`@${ __filename }`]: "一行公排分配" });
const { Decimal } = require("decimal.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants");
const { allocateSurplusAssets } = require("../systemPool");
const { getMainAccountBySub } = require("../../models/subAccount/index.js");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");
const { pool } = require("../../db/index.js");
const { redis } = require("../../common/index.js");

/**
 * 一行公排收益分配
 * @param { number } amount 一行公排收益
 * @param { String[] } staticSortList
 */
async function staticSort(amount, staticSortList) {
    try {
        // 用户投资时， 一行公排可分配额度
        const sortEnable = new Decimal(amount).mul(INVEST_CONSTANT.SORT_INCOME_RATE / INVEST_CONSTANT.BASE_RATE);
        const len = staticSortList.length;
        logger.debug("staticSortList: ", staticSortList);
        // 前期账号不足分配多出余额
        // 40% 开发 60% 社区
        // 分配收益小于 20UE 的帐号
        let totalDis = new Decimal(0);
        if (len <= 5) {
            // todo: 最后五个帐号可均分 amount 的 25%， 其余分给社区，开发
            const { distributed } = await handleStaticSort(sortEnable, staticSortList, 5);
            totalDis = totalDis.add(distributed);
        } else if (len <= 55) {
            // todo:  除去上一个条件的帐号可均分 amount 的 25%， 其余分给社区，开发
            let lastList = staticSortList.splice(-5);
            let preList = staticSortList;
            const { distributed } = await handleStaticSort(sortEnable, lastList, 5);
            await handleStaticSort(sortEnable, preList, 50);
            totalDis = totalDis.add(distributed);
        } else if (len <= 60) {
            // todo: 除去上两个条件的帐号可均分 amount 的 25%， 其余分给社区，开发
            let lastList = staticSortList.splice(-5);
            let preList = staticSortList.splice(-50);
            let frontList = staticSortList;
            const { distributed } = await handleStaticSort(sortEnable, lastList, 5);
            await handleStaticSort(sortEnable, preList, 5);
            await handleStaticSort(sortEnable, frontList, 5);
            totalDis = totalDis.add(distributed);
        } else {
            // 每段都均分 amount 的 25%
            let lastList = staticSortList.splice(-5);
            let preList = staticSortList.splice(-50);
            let frontList = staticSortList.splice(0, 5);
            let other = staticSortList;
            await handleStaticSort(sortEnable, lastList, 5);
            await handleStaticSort(sortEnable, preList, 50);
            await handleStaticSort(sortEnable, frontList, 5);
            await handleStaticSort(sortEnable, other, other.length);
        }
    
        // 系统账户
        let last = sortEnable.minus(totalDis);
        if (!last.lessThanOrEqualTo(0)) {
            await allocateSurplusAssets(pool, sortEnable, totalDis, OPT_CONSTANTS.SORT);
        }
    } catch (err) {
        logger.error("allocating sort income error, the error stock is %O", err);
        throw err;
    }
}

/**
 * 分配一行公排的收益
 * @param { any } sortEnable 
 * @param { String[] } sortList
 * @param { number } len
 */
async function handleStaticSort(sortEnable, sortList, len) {
    const avg = sortEnable.mul(INCOME_CONSTANT.SORT_INCOME / INCOME_CONSTANT.BASE_RATE).div(len);
    logger.debug("avg: ", avg);
    // 根据子账号查询对应的信息
    const mainAccountList = await getMainAccountBySub(sortList);
    const accountNameList = Array.from(new Set(mainAccountList.map(item => item.main_account)));
    logger.debug("mainAccountList: %O, accountNameList: %O", mainAccountList, accountNameList);
    // 查找主帐户的收益信息
    let distributed = new Decimal(0);
    for (let i = 0; i < mainAccountList.length; i++) {
        const mainAccount = mainAccountList[i];
        const mainAccountName = mainAccount.main_account;
        logger.debug("handleStaticSort: ", mainAccount);
        const remark = `subAccount ${ mainAccount.sub_account_name }, income ${ avg.toFixed(8) }`;
        const now = new Date();
        const data = {
            "account_name": mainAccountName,
            "change_amount": avg,
            "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
            "op_type": OPT_CONSTANTS.SORT,
            "extra": { "symbol": UE_TOKEN_SYMBOL },
            "remark": remark
        }
        // 将获取的收益添加到 redis
        await storeIncome(mainAccountName, OPT_CONSTANTS.SORT, data);
        // 获取加子账号的收益
        const incomeKey = `tbg:subAccountSort:${ mainAccount.sub_account_name }`;
        const subAccountIncome = await redis.get(incomeKey);
        if (!!subAccountIncome) {
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
        distributed = distributed.add(avg);
    }
    
    // let last = sortEnable.minus(distributed);
    return {
        sortEnable: sortEnable,
        distributed: distributed
    }
}

module.exports = staticSort;