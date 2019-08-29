// @ts-check
const logger = require("../../common/logger.js").child({ "@src/models/account/handleRepeat.js": "用户复投" });
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const BALANCE_CONSTANT = require("../../common/constant/balanceConstants");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { TSH_INCOME } = require("../../common/constant/accountConstant.js");
const { getUserReferrer } = require("../../models/referrer");
const { updateRepeatBalance, insertBalanceLog, getUserBalance } = require("../../models/balance");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");
const { Decimal }= require("decimal.js");
const { getOneAccount } = require("../../models/systemPool");
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
        const accountName = accountInfo.account_name;
        const repeatAmount = BALANCE_CONSTANT.BASE_RATE;
        const accountBalance = await getUserBalance(accountName);
        // 如果复投额度不足, 不做处理
        const repeatCurrency = new Decimal(accountBalance.repeat_currency);
        if (repeatCurrency.lessThan(repeatAmount)) {
            return tshIncomeData;
        }
        const accountOpType = OPT_CONSTANTS.REPEAT;
        userInvestmentRemark = `user ${ accountName } repeat ${ repeatAmount } UE`
        await updateRepeatBalance(client, accountName, repeatAmount);
        await insertBalanceLog(client, accountName, repeatAmount, repeatCurrency.minus(repeatAmount).toNumber(), accountOpType, { "symbol": UE_TOKEN_SYMBOL }, userInvestmentRemark, 'now()');
        // 如果第一个全球合伙人自己复投，多出的部分转到股东池账户
        // 全球合伙人可得复投额度的 1%
        const globalChangeAmount = repeatAmount * INVEST_CONSTANT.REPEAT_GLOBAL_INCOME_RATE / INVEST_CONSTANT.BASE_RATE;
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
        logger.debug("userReferrer: ", userReferrer);
        const changeAmount = repeatAmount * INVEST_CONSTANT.REPEAT_GLOBAL_REFERRER_INCOME_RATE / INVEST_CONSTANT.BASE_RATE;
        if (!userReferrer) {
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            let rows = await getOneAccount(TSH_INCOME);
            if (!rows) {
                logger.debug(`system account ${ TSH_INCOME } not found`);
                throw Error(`system account ${ TSH_INCOME } not found`);
            }
            tshIncomeData = {
                "changeAmount": changeAmount,
                "memo": `user ${ accountName } at ${ df.format(now, "YYYY-MM-DD : HH:mm:ssZ") } ${ OPT_CONSTANTS.REPEAT }, allocating repeat surplus assets to ${ TSH_INCOME }`
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