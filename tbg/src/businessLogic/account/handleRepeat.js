// @ts-check
const logger = require("../../common/logger.js").child({ "@src/models/account/handleRepeat.js": "用户复投" });
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const BALANCE_CONSTANT = require("../../common/constant/balanceConstants");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { TSH_INCOME } = require("../../common/constant/accountConstant.js");
const { getUserReferrer } = require("../../models/referrer");
const { updateRepeatBalance } = require("../../models/balance");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount, getOneAccount } = require("../../models/systemPool");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");

/**
 * 用户复投
 * @param { any } client
 * @param { DB.Account } accountInfo 用户的帐号
 * @param { String } globalAccount 子账号
 * @param { String } userInvestmentRemark remark
 */
async function handleRepeat(client, accountInfo, globalAccount, userInvestmentRemark) {
    try {
        let tshIncomeData = {};
        const accountName = accountInfo.account_type;
        const accountOpType = OPT_CONSTANTS.REPEAT;
        userInvestmentRemark = `user ${ accountName } repeat ${ BALANCE_CONSTANT.BASE_RATE } UE`
        await updateRepeatBalance(client, accountName, BALANCE_CONSTANT.BASE_RATE);
        // 如果第一个全球合伙人自己复投，多出的部分转到股东池账户
        // 全球合伙人可得复投额度的 1%
        const globalChangeAmount = BALANCE_CONSTANT.BASE_RATE * INVEST_CONSTANT.REPEAT_GLOBAL_INCOME_RATE / INVEST_CONSTANT.BASE_RATE;
        const globalMemo = `${ userInvestmentRemark }, global account ${ globalAccount } add ${ globalChangeAmount } UE currency`;
        const now = new Date();
        const globalData = {
            "account_name": globalAccount,
            "change_amount": globalChangeAmount,
            "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
            "op_type": accountOpType,
            "remark": globalMemo
        }
        // 存入 redis，待用户点击的时候再收取
        await storeIncome(globalAccount, accountOpType, globalData);

        // 全球合伙人的推荐人可得复投额度的 0.5%
        const userReferrer = await getUserReferrer(globalAccount);
        const changeAmount = BALANCE_CONSTANT.BASE_RATE * INVEST_CONSTANT.REPEAT_GLOBAL_REFERRER_INCOME_RATE / INVEST_CONSTANT.BASE_RATE;
        if (!userReferrer) {
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            let rows = await getOneAccount(TSH_INCOME);
            if (!rows) {
                logger.debug(`system account ${ TSH_INCOME } not found`);
                throw Error(`system account ${ TSH_INCOME } not found`);
            }
            const opType = OPT_CONSTANTS.INVITE;
            const current = rows.pool_amount + changeAmount;
            const memo = `${ userInvestmentRemark }, global account's referrer ${ userReferrer } add ${ changeAmount } UE currency`;
            await insertSystemOpLog(client, changeAmount, current, { "symbol": UE_TOKEN_SYMBOL, aid: TSH_INCOME }, opType, memo, "now()");
            await updateSystemAmount(client, TSH_INCOME, changeAmount, current, UE_TOKEN_SYMBOL);
            tshIncomeData = {
                "changeAmount": changeAmount,
                "currentBalance": current,
                "memo": memo
            }
        } else {
            const memo = `${ userInvestmentRemark }, global account's referrer ${ userReferrer } add ${ changeAmount } UE currency`;
            const data = {
                "account_name": userReferrer,
                "change_amount": changeAmount,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": accountOpType,
                "remark": memo
            }
            // 存入 redis，待用户点击的时候再收取
            await storeIncome(userReferrer, accountOpType, data);
        }
        return tshIncomeData;
    } catch (err) {
        logger.error("handle user repeat invest assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = handleRepeat