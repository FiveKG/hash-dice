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
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount, getOneAccount } = require("../../models/systemPool");

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
        const now = new Date();
        if (total <= TBG_ALLOCATE.BIND_MEMBER_LIMIT) {
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            const bindId = OPT_CONSTANTS.BIND;
            const acBalanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: bindId });
            if (!userReferrer) {
                const bindAirdrop = TBG_ALLOCATE.BIND_ACCOUNT_AIRDROP;
                const acCurrentBalance = new Decimal(acBalanceLogInfo[0].current_balance).add(bindAirdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, get airdrop ${ bindAirdrop }`;
                bindData = {
                    "account": {
                        "updateTbgBalance": [ accountName, bindAirdrop, 0, 0 ],
                        "insertBalanceLog": [ accountName, bindAirdrop, acCurrentBalance, bindId, {}, acBalanceRemark, now ]
                    }
                }

                // 系统第一个账户没有推荐人，多出的部分转到股东池账户
                let rows = await getOneAccount(TSH_INCOME);
                if (!rows) {
                    logger.debug(`system account ${ TSH_INCOME } not found`);
                    throw Error(`system account ${ TSH_INCOME } not found`);
                }
                const current = rows.pool_amount +  TBG_ALLOCATE.BIND_REFERRER_AIRDROP;
                tshIncomeData = {
                    "changeAmount": bindAirdrop,
                    "currentBalance": current,
                    "memo": acBalanceRemark
                }
                await insertSystemOpLog(client, bindAirdrop, current, {}, bindId, acBalanceRemark, now);
                await updateSystemAmount(client, TSH_INCOME,  bindAirdrop, current);
            } else {
                // 新用户可获得的空投额度
                const bindAirdrop = TBG_ALLOCATE.BIND_ACCOUNT_AIRDROP;
                const reBalanceLogInfo = await getBalanceLogInfo({ accountName: userReferrer, opType: bindId });
                const acCurrentBalance = new Decimal(acBalanceLogInfo[0].current_balance).add(bindAirdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, get airdrop ${ bindAirdrop }`;
                const reCurrentBalance = new Decimal(reBalanceLogInfo[0].current_balance).add(TBG_ALLOCATE.BIND_REFERRER_AIRDROP);
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, referrer ${ userReferrer } get airdrop ${ TBG_ALLOCATE.BIND_REFERRER_AIRDROP }`;
                bindData = {
                    "account": {
                        "updateTbgBalance": [ accountName, bindAirdrop, 0, 0 ],
                        "insertBalanceLog": [ accountName, bindAirdrop, acCurrentBalance, bindId, {}, acBalanceRemark, now ]
                    },
                    "referrer": {
                        "updateTbgBalance": [ userReferrer, TBG_ALLOCATE.BIND_REFERRER_AIRDROP, 0, 0 ],
                        "insertBalanceLog": [ userReferrer, TBG_ALLOCATE.BIND_REFERRER_AIRDROP, reCurrentBalance, bindId, {}, reBalanceRemark, now ]
                    }
                }
            }
        }

        // 如果新用户是在绑定后 48h 内投资的，还可获得绑定空投，新用户空投 20，推荐人空投 10, 只空投前 100,000 个UE账号
        if (total <= TBG_ALLOCATE.TBG_1_MEMBER_LIMIT && df.differenceInHours(now, create_time) < 48) {
            // 系统第一个账户没有推荐人，空投全部给他
            const tbg1Id = OPT_CONSTANTS.TBG_1;
            const acBalanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: tbg1Id });
            if (!userReferrer) {
                const tbg1Airdrop = TBG_ALLOCATE.TBG_1_ACCOUNT_AIRDROP;
                const acCurrentBalance = new Decimal(acBalanceLogInfo[0].current_balance).add(tbg1Airdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, get airdrop ${ tbg1Airdrop }`;
                tbg1Data = {
                    "account": {
                        "updateTbgBalance": [ accountName, tbg1Airdrop, 0, 0 ],
                        "insertBalanceLog": [ accountName, tbg1Airdrop, acCurrentBalance, tbg1Id, {}, acBalanceRemark, now ]
                    }
                }

                // 系统第一个账户没有推荐人，多出的部分转到股东池账户
                let rows = await getOneAccount(TSH_INCOME);
                if (!rows) {
                    logger.debug(`system account ${ TSH_INCOME } not found`);
                    throw Error(`system account ${ TSH_INCOME } not found`);
                }
                const current = rows.pool_amount + TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP;
                tshIncomeData = {
                    "changeAmount": tbg1Airdrop,
                    "currentBalance": current,
                    "memo": acBalanceRemark
                }
                await insertSystemOpLog(client, tbg1Airdrop, current, {}, tbg1Id, acBalanceRemark, "now()");
                await updateSystemAmount(client, TSH_INCOME,  tbg1Airdrop, current);
            } else {
                const tbg1Airdrop = TBG_ALLOCATE.TBG_1_ACCOUNT_AIRDROP;
                const reBalanceLogInfo = await getBalanceLogInfo({ accountName: userReferrer, opType: tbg1Id });
                const acCurrentBalance = new Decimal(acBalanceLogInfo[0].current_balance).add(tbg1Airdrop);
                const acBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, get airdrop ${ tbg1Airdrop }`;
                const reCurrentBalance = new Decimal(reBalanceLogInfo[0].current_balance).add(TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP);
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.INVESTMENT }, referrer ${ userReferrer } get airdrop ${ TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP }`;
                tbg1Data = {
                    "account": {
                        "updateTbgBalance": [ accountName, tbg1Airdrop, 0, 0 ],
                        "insertBalanceLog": [ accountName, tbg1Airdrop, acCurrentBalance, tbg1Id, {}, acBalanceRemark, now ]
                    },
                    "referrer": {
                        "updateTbgBalance": [ userReferrer, TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP, 0, 0 ],
                        "insertBalanceLog": [ userReferrer, TBG_ALLOCATE.TBG_1_REFERRER_AIRDROP, reCurrentBalance, tbg1Id, {}, reBalanceRemark, now ]
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