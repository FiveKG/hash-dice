// @ts-check
const { pool } = require("../../db");
const { getStaticSort } = require("../../models/account");
const { Decimal } = require("decimal.js");
const rateConstant = require("../../common/constant/rateConstant.js");
const { DEV_OP_POOL, COMMUNITY_POOL } = require("../../common/constant/accountConstant");
const { personalAssetChange, systemAssetChange } = require("../../models/asset");
const { getOneAccount } = require("../../models/systemPool");
const logger = require("../../common/logger.js");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");

/**
 * 一行公排收益分配
 * @param { any } client
 * @param { Number } amount 一行公排收益
 */
async function staticSort(client, amount) {
    try {
        // 用户投资时， 一行公排可分配额度
        let sortEnable = new Decimal(amount).mul(rateConstant.SORT_INCOME_RATE / rateConstant.BASE_RATE);
        // 一行公排的所有帐号
        let rows = await getStaticSort();
        // 该用户的子帐号
        let sortList = rows.user_level;
        let len = sortList.length;
        if (!len) {
            return
        }

        sortList.shift();
        console.log("sortList: ", sortList);
        // 前期账号不足分配多出余额
        // 40% 开发 60% 社区
        // 分配须不包含收益大于 150 EOS 的帐号
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
 * @param { Decimal } sortEnable 
 * @param { String[] } sortList 
 * @param { Boolean } flag 
 */
async function handleStaticSort(client, sortEnable, sortList,flag) {
    let avg = sortEnable.mul(25 / 100).div(sortList.length);
    for (let i = 0; i < sortList.length; i++) {
        let account = await getStaticSortMainAccount(sortList[i]);
        console.log("handleStaticSort: ", account, sortList[i]);
        let opType = `sort income`;
        let remark = `subAccount ${ sortList[i] }, income ${ avg.toFixed(8) }`;
        let amount = new Decimal(account.amount);
        if (amount.lessThan(45)) {
            let now = new Date();
            let data = {
                "account_name": account.account_name,
                "change_amount": avg,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": opType,
                "remark": remark
            }
            await storeIncome(account.account_name, "sort", data);
            // await personalAssetChange(client, account.account_name, avg, opType, remark);
        }
    }
    
    if (flag) {
        let devAccount = await getOneAccount(DEV_OP_POOL);
        let communityAccount = await getOneAccount(COMMUNITY_POOL);
        if (!devAccount) {
            logger.debug(`system account ${ DEV_OP_POOL } not found`);
            return;
        }
        if (!communityAccount) {
            logger.debug(`system account ${ COMMUNITY_POOL } not found`);
            return
        }
        let last = sortEnable.minus(avg);
        let devRemark = `distribution sort income, add ${ DEV_OP_POOL } ${ last.mul(40 / 100) } amount`;
        let communityRemark = `distribution sort income, add ${ COMMUNITY_POOL } ${ last.mul(60 / 100) } amount`;
        await systemAssetChange(client, DEV_OP_POOL, last.mul(40 / 100), devAccount.pool_amount, 'sort last', devRemark);
        await systemAssetChange(client, COMMUNITY_POOL, last.mul(60 / 100), communityAccount.pool_amount, 'sort last', communityRemark);
    }
}

/**
 * 查找收益小于 150 的一行公排对应的主帐号
 * @param { String } subAccount 子帐号
 */
async function getStaticSortMainAccount(subAccount) {
    try {
        let sql = `
            select b.op_type, b.account_name, sum(change_amount) as amount
                from balance_log b join (
                        select distinct main_account from sub_account 
                        where sub_account_name = '${ subAccount }'
                    ) s on s.main_account = b.account_name 
                    where b.op_type = 'sort income' group by b.op_type, b.account_name;
        `

        let { rows } = await pool.query(sql);
        return rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = staticSort;