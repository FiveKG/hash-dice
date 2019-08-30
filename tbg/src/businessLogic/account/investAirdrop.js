// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/models/account/investAirdrop.js": "invest airdrop" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../../common/constant/tbgAllocateRate");
const { getUserReferrer } = require("../../models/referrer");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const df = require("date-fns");
const { TSH_INCOME } = require("../../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL, UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateTbgBalance, getTbgBalanceInfo } = require("../../models/tbgBalance");
const { updateSystemAmount, getOneAccount } = require("../../models/systemPool");
const { format } = require("date-fns");

/**
 * 用户投资
 * @param { any } client
 * @param { String } accountName 用户的帐号
 * @param { any } create_time
 */
async function investAirdrop(client, accountName, create_time) {
    try {
        let bindData = {};
        let tbg1Data = {};
        let tshIncomeData = {};
        // 第一次投资，可以获得参与 tbg1 空投，新用户空投 100，推荐人空投 50, 只空投前 300,000 个UE账号
        const { rows: [ { total } ] } = await pool.query("SELECT count(1)::INTEGER AS total  FROM account");
        let userReferrer = await getUserReferrer(accountName);
        // 获取推荐人当前的余额
        const accountTbgBalance = await getTbgBalanceInfo(accountName);
        let referrerTbgBalance = null;
        const now = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
        if (total <= TBG_ALLOCATE.BIND_MEMBER_LIMIT) {
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            const bindId = OPT_CONSTANTS.BIND;
            if (!userReferrer) {
                const bindAirdrop = TBG_ALLOCATE.BIND_ACCOUNT_AIRDROP;
                const acCurrentBalance = new Decimal(accountTbgBalance.release_amount).add(bindAirdrop);
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
                const acCurrentBalance = new Decimal(accountTbgBalance.release_amount).add(bindAirdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, reward airdrop ${ bindAirdrop }`;
                const reCurrentBalance = new Decimal(referrerTbgBalance.release_amount).add(TBG_ALLOCATE.BIND_REFERRER_AIRDROP);
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

        // 如果新用户是在绑定后 48h 内投资的，还可获得绑定空投，新用户空投 20，推荐人空投 10, 只空投前 100,000 个UE账号
        if (total <= TBG_ALLOCATE.TBG_1_MEMBER_LIMIT && df.differenceInHours(now, create_time) < 48) {
            // 系统第一个账户没有推荐人，空投全部给他
            const tbg1Id = OPT_CONSTANTS.TBG_1;
            if (!userReferrer) {
                const tbg1Airdrop = TBG_ALLOCATE.TBG_1_ACCOUNT_AIRDROP;
                const acCurrentBalance = new Decimal(accountTbgBalance.release_amount).add(tbg1Airdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, reward airdrop ${ tbg1Airdrop }`;
                tbg1Data = {
                    "account": {
                        "account_name": accountName,
                        "release_amount": tbg1Airdrop,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": acCurrentBalance,
                        "op_type": tbg1Id,
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
                    "changeAmount": tbg1Airdrop,
                    "memo": `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, allocating tbg1 surplus assets to ${ TSH_INCOME }`
                }
            } else {
                const tbg1Airdrop = TBG_ALLOCATE.TBG_1_ACCOUNT_AIRDROP;
                if (!referrerTbgBalance) {
                    referrerTbgBalance = await getTbgBalanceInfo(userReferrer);
                }
                // 增加空投收益到当前余额
                const acCurrentBalance = new Decimal(accountTbgBalance.release_amount).add(tbg1Airdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, reward airdrop ${ tbg1Airdrop }`;
                const reCurrentBalance = new Decimal(referrerTbgBalance.release_amount).add(TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP);
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, account referrer ${ userReferrer } get airdrop ${ TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP }`;
                tbg1Data = {
                    "account": {
                        "account_name": accountName,
                        "release_amount": tbg1Airdrop,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": acCurrentBalance,
                        "op_type": tbg1Id,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": acBalanceRemark,
                        "create_time": now
                    },
                    "referrer": {
                        "account_name": userReferrer,
                        "release_amount": TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP,
                        "sell_amount": 0,
                        "active_amount": 0,
                        "current_balance": reCurrentBalance,
                        "op_type": tbg1Id,
                        "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                        "remark": reBalanceRemark,
                        "create_time": now
                    }
                }
            }
        }
        return {
            tbg1Data,
            bindData,
            tshIncomeData
        }
    } catch (err) {
        logger.error("allocate user investment assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = investAirdrop