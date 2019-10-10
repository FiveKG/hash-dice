// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "invest airdrop" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../../common/constant/tbgAllocateRate");
const { getUserReferrer } = require("../../models/referrer");
const df = require("date-fns");
const { TSH_INCOME, ACCOUNT_ACTIVATED_TBG_2, ACCOUNT_ACTIVATED_TBG_1_AND_2 } = require("../../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL, UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { getTbgBalanceInfo } = require("../../models/tbgBalance");
const { getOneAccount } = require("../../models/systemPool");
const { format } = require("date-fns");

/**
 * 用户投资
 * @param { String } accountName 用户的帐号
 * @param { any } create_time
 */
async function investAirdrop(accountName, create_time) {
    try {
        let bindData = null;
        let tbg2Data = null;
        let tshIncomeData = null;
        const { rows: [ { total } ] } = await pool.query("SELECT count(1)::INTEGER AS total  FROM account");
        let userReferrer = await getUserReferrer(accountName);
        // 获取推荐人当前的余额
        const accountTbgBalance = await getTbgBalanceInfo(accountName);
        let acCurrentBalance = new Decimal(accountTbgBalance.release_amount);
        let reCurrentBalance = new Decimal(0);
        let referrerTbgBalance = null;
        const now = format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
        // 如果新用户是在绑定后 48h 内投资的，还可获得绑定空投，新用户空投 20，推荐人空投 10, 只空投前 100,000 个UE账号
        if (total <= TBG_ALLOCATE.BIND_MEMBER_LIMIT && df.differenceInHours(now, create_time) < 48) {
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            const bindId = OPT_CONSTANTS.BIND;
            if (!userReferrer) {
                const bindAirdrop = TBG_ALLOCATE.BIND_ACCOUNT_AIRDROP;
                acCurrentBalance = acCurrentBalance.add(bindAirdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, reward airdrop ${ bindAirdrop }`;
                bindData = {
                    "account": {
                        "account_name": accountName,
                        "release_amount": bindAirdrop,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": acCurrentBalance,
                        "op_type": bindId,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": acBalanceRemark,
                        "create_time": now
                    }
                }

                // 系统第一个账户没有推荐人，多出的部分转到股东池账户
                let rows = await getOneAccount(TSH_INCOME);
                if (!rows) {
                    logger.debug(`system account ${ TSH_INCOME } not found`);
                    throw Error(`system account ${ TSH_INCOME } not found`);
                }
                tshIncomeData = {
                    "changeAmount": bindAirdrop,
                    "memo": `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, allocating bind surplus assets to ${ TSH_INCOME }`
                }
            } else {
                // 新用户可获得的空投额度
                referrerTbgBalance = await getTbgBalanceInfo(userReferrer);
                const bindAirdrop = TBG_ALLOCATE.BIND_ACCOUNT_AIRDROP;
                acCurrentBalance = acCurrentBalance.add(bindAirdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, reward airdrop ${ bindAirdrop }`;
                reCurrentBalance = new Decimal(reCurrentBalance).add(referrerTbgBalance.release_amount).add(TBG_ALLOCATE.BIND_REFERRER_AIRDROP);
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, account referrer ${ userReferrer } get airdrop ${ TBG_ALLOCATE.BIND_REFERRER_AIRDROP }`;
                bindData = {
                    "account": {
                        "account_name": accountName,
                        "release_amount": bindAirdrop,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": acCurrentBalance,
                        "op_type": bindId,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": acBalanceRemark,
                        "create_time": now
                    },
                    "referrer": {
                        "account_name": userReferrer,
                        "release_amount": bindAirdrop,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": reCurrentBalance,
                        "op_type": bindId,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": reBalanceRemark,
                        "create_time": now
                    }
                }
            }
        }

        /**
         * 参与 TBG-II 按阶段（按投资时间)，复投不再空投
         * 3.5%，共 35,000,000 TBG
         * 前 50,000 个账号参与 TBG-II 即空投
         */
        const selectTbg2Sql = "SELECT count(1)::INTEGER AS total  FROM account where state = $1 or state = $2";
        const opts = [ ACCOUNT_ACTIVATED_TBG_2, ACCOUNT_ACTIVATED_TBG_1_AND_2 ]
        const { rows: [ { total: totalTbg2 } ] } = await pool.query(selectTbg2Sql, opts);
        if (totalTbg2 <= TBG_ALLOCATE.TBG_2_MEMBER_LIMIT) {
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            const tbg2Id = OPT_CONSTANTS.TBG_2;
            const tbg2Airdrop = allocAmount(totalTbg2);
            if (!userReferrer) {
                acCurrentBalance = acCurrentBalance.add(tbg2Airdrop.acc);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, reward airdrop ${ tbg2Airdrop.acc }`;
                tbg2Data = {
                    "account": {
                        "account_name": accountName,
                        "release_amount": tbg2Airdrop.acc,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": acCurrentBalance,
                        "op_type": tbg2Id,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": acBalanceRemark,
                        "create_time": now
                    }
                }

                // 系统第一个账户没有推荐人，多出的部分转到股东池账户
                let rows = await getOneAccount(TSH_INCOME);
                if (!rows) {
                    logger.debug(`system account ${ TSH_INCOME } not found`);
                    throw Error(`system account ${ TSH_INCOME } not found`);
                }
                tshIncomeData = {
                    "changeAmount": tbg2Airdrop.ref,
                    "memo": `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, allocating surplus assets to ${ TSH_INCOME }`
                }
            } else {
                // 如果获取过推荐人资产，则不再获取
                if (!referrerTbgBalance) {
                    referrerTbgBalance = await getTbgBalanceInfo(userReferrer);
                    reCurrentBalance = reCurrentBalance.add(referrerTbgBalance.release_amount);
                }
                // 增加空投收益到当前余额
                acCurrentBalance = acCurrentBalance.add(tbg2Airdrop.acc);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, reward airdrop ${ tbg2Airdrop.acc }`;
                reCurrentBalance = reCurrentBalance.add(tbg2Airdrop.ref);
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, account referrer ${ userReferrer } get airdrop ${ tbg2Airdrop.ref }`;
                tbg2Data = {
                    "account": {
                        "account_name": accountName,
                        "release_amount": tbg2Airdrop.acc,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": acCurrentBalance,
                        "op_type": tbg2Id,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": acBalanceRemark,
                        "create_time": now
                    },
                    "referrer": {
                        "account_name": userReferrer,
                        "release_amount": tbg2Airdrop.ref,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": reCurrentBalance,
                        "op_type": tbg2Id,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": reBalanceRemark,
                        "create_time": now
                    }
                }
            }
        }
        return {
            tbg2Data,
            bindData,
            tshIncomeData
        }
    } catch (err) {
        logger.error("allocate user investment assets error, the error stock is %O", err);
        throw err;
    }
}

/**
 * 设置分配比例
 * @param { number } tbg2Count 参加 tbg2 的人数
 */
function allocAmount(tbg2Count) {
    if (tbg2Count <= 5000) {
        return { acc: 1000, ref: 240 }
    } else if (tbg2Count <= 10000) {
        return { acc: 900, ref: 220 } 
    } else if (tbg2Count <= 15000) {
        return { acc: 800, ref: 200 } 
    } else if (tbg2Count <= 20000) {
        return { acc: 700, ref: 180 } 
    } else if (tbg2Count <= 25000) {
        return { acc: 600, ref: 160 } 
    } else if (tbg2Count <= 30000) {
        return { acc: 500, ref: 140 } 
    } else if (tbg2Count <= 35000) {
        return { acc: 400, ref: 120 } 
    } else if (tbg2Count <= 40000) {
        return { acc: 300, ref: 100 } 
    } else if (tbg2Count <= 45000) {
        return { acc: 200, ref: 80 } 
    } else {
        return { acc: 100, ref: 60 } 
    } 
}

module.exports = investAirdrop