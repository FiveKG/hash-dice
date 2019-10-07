// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "分配用户投资时全球合伙人和全球合伙人的推荐人收益" });
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const BALANCE_CONSTANT = require("../../common/constant/balanceConstants");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { TSH_INCOME, NODE_INCENTIVE_POOL } = require("../../common/constant/accountConstant.js");
const { getUserReferrer } = require("../../models/referrer");
const { updateRepeatBalance, insertBalanceLog, getUserBalance } = require("../../models/balance");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");
const { Decimal }= require("decimal.js");
const { getOneAccount } = require("../../models/systemPool");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { pool } = require("../../db/index.js");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount } = require("../../models/systemPool");

/**
 * 分配用户投资时全球合伙人和全球合伙人的推荐人收益
 * @param { DB.Account } accountInfo 用户的帐号
 * @param { String } globalAccount 全球合伙人帐号
 * @param { String } userInvestmentRemark remark
 * @param { String } accountOpType remark
 */
async function globalPartnerIncome(accountInfo, globalAccount, userInvestmentRemark, accountOpType) {
    try {
        const accountName = accountInfo.account_name;
        const repeatAmount = new Decimal(INVEST_CONSTANT.INVEST_AMOUNT);
        let globalCount = 1;
        // 查找快照中的记录
        const selectSnapshotSql = `SELECT * FROM snapshot WHERE account_name = $1`;
        const { rows: [ globalSnapshotInfo ] } = await pool.query(selectSnapshotSql, [ globalAccount ]);
        logger.debug("globalSnapshotInfo: ", globalSnapshotInfo);
        if (!!globalSnapshotInfo) {
            globalCount = globalSnapshotInfo.effective_member;
        }

        let globalRate = 0.001;
        if (globalCount < 20) {
            globalRate = 0.001;
        } else if (globalCount < 40) {
            globalRate = 0.002;
        } else if (globalCount < 60) {
            globalRate = 0.004;            
        } else if (globalCount < 80) {
            globalRate = 0.006;
        } else if (globalCount < 100) {
            globalRate = 0.008;
        } else {
            globalRate = 0.01;
        }
        // 如果第一个全球合伙人自己复投，多出的部分转到股东池账户
        const globalChangeAmount = repeatAmount.mul(globalRate);
        let last = repeatAmount.mul(0.01 - globalRate);
        const globalMemo = `${ userInvestmentRemark }, global account ${ globalAccount } add ${ globalChangeAmount } UE currency`;
        const now = new Date();
        const globalData = {
            "account_name": globalAccount,
            "change_amount": globalChangeAmount,
            "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
            "op_type": accountOpType,
            "extra": { "symbol": UE_TOKEN_SYMBOL },
            "remark": globalMemo
        }
        
        // 存入 redis，待用户点击的时候再收取
        await storeIncome(globalAccount, accountOpType, globalData);

        // 全球合伙人的推荐人可得 0.5%
        const userReferrer = await getUserReferrer(globalAccount);
        logger.debug("userReferrer: ", userReferrer);
        if (!!userReferrer) {
            let globalReferrerCount = 1;
            const selectSnapshotSql = `SELECT * FROM snapshot WHERE account_name = $1`;
            const { rows: [ snapshotInfo ] } = await pool.query(selectSnapshotSql, [ globalAccount ]);
            logger.debug("snapshotInfo: ", snapshotInfo);
            if (!!snapshotInfo) {
                globalReferrerCount = snapshotInfo.effective_member;
            }
            let globalReferrerRate = 0.001;
            if (globalReferrerCount < 100) {
                globalReferrerRate = 0.001;
            } else {
                globalReferrerRate = 0.005;
            }
            const changeAmount = repeatAmount.mul(globalReferrerRate);
            last = last.add(repeatAmount.mul(0.005 - globalReferrerRate));
            const memo = `${ userInvestmentRemark }, global account's referrer ${ userReferrer } add ${ changeAmount } UE currency`;
            const data = {
                "account_name": userReferrer,
                "change_amount": changeAmount,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": accountOpType,
                "extra": { "symbol": UE_TOKEN_SYMBOL },
                "remark": memo
            }
            // 存入 redis，待用户点击的时候再收取
            await storeIncome(userReferrer, accountOpType, data);
        }

        const memo = `user ${ accountName } at ${ df.format(now, "YYYY-MM-DD HH:mm:ssZ") } ${ accountOpType }, allocating surplus assets to ${ NODE_INCENTIVE_POOL }`
        logger.debug(`last: ${ last }`);

        return {
            last: last,
            memo: memo,
            account_name: NODE_INCENTIVE_POOL
        }
    } catch (err) {
        logger.error("handle user repeat invest assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = globalPartnerIncome