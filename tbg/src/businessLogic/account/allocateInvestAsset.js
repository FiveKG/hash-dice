// @ts-check
const { pool, psTbg2, psBind, psTshIncome } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "allocate invest asset" });
const { Decimal } = require("decimal.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const ACCOUNT_RATE = require("../../common/constant/accountRate.js");
const ACCOUNT_CONSTANT = require("../../common/constant/accountConstant.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount, getSystemAccountInfo } = require("../../models/systemPool");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { insertAccountOp } = require("../../models/accountOp");
const addSubAccount = require("./addSubAccount.js");
const { updateAccountState, getAccountInfo, getGlobalAccount } = require("../../models/account")
const globalPartnerIncome = require("./globalPartnerIncome");
const investAirdrop = require("./investAirdrop.js");
const investReward = require("./investReward.js");
const BALANCE_CONSTANT = require("../../common/constant/balanceConstants");
const { updateRepeatBalance, insertBalanceLog, getUserBalance } = require("../../models/balance");

/**
 * 用户投资
 * @param { number } amount 投资额度， decimal 类型
 * @param { String } accountName 用户的帐号
 * @param { String } newSubAccount 子账号
 * @param { String } userInvestmentRemark remark
 * @param { string[] } referrerAccountList
 * @param { DB.Account } accountInfo
 */
async function allocateInvestAsset(amount, accountName, newSubAccount, userInvestmentRemark, referrerAccountList, accountInfo) {
    let investAmount = new Decimal(amount);
    let client = await pool.connect();
    await client.query("BEGIN");
    try {
        let psBindData = {};
        let psTbg2Data = {};
        let psTshIncomeData = {};
        // const accountInfo = await getAccountInfo(accountName);
        // 只要用户投资 TBG-II（转账 2000.0000 UE）, 全球合伙人和全球合伙人的推荐人就可获得奖励
        // 奖励按有效会员数来分配
        // 全球合伙人: | 0-19 0.1% | 20-39 0.2% | 40-59 0.4% | 60-79 0.6% | 80-99 0.8% | > 99 1%
        // 全球合伙人的推荐人: < 100 0.1% | >= 100 0.5%
        const globalAccountInfo = await getGlobalAccount(ACCOUNT_CONSTANT.ACCOUNT_TYPE.GLOBAL, referrerAccountList);
        const globalAccount = globalAccountInfo.account_name;
        let accountOpType = OPT_CONSTANTS.INVITE;
        // 用户复投
        if (accountInfo.state === ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_2 || accountInfo.state === ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1_AND_2) {
            accountOpType = OPT_CONSTANTS.REPEAT;
            const accountBalance = await getUserBalance(accountName);
            const repeatAmount = BALANCE_CONSTANT.BASE_RATE;
            // 如果复投额度不足, 不做处理
            const repeatCurrency = new Decimal(accountBalance.repeat_currency);
            if (repeatCurrency.lessThan(repeatAmount)) {
                throw Error("用户复投，但是复投额度不足，请检查逻辑");
            }
            userInvestmentRemark = `user ${ accountName } repeat ${ repeatAmount } UE`
            await updateRepeatBalance(client, accountName, repeatAmount);
            await insertBalanceLog(client, accountName, repeatAmount, repeatCurrency.minus(repeatAmount).toNumber(), accountOpType, { "symbol": UE_TOKEN_SYMBOL }, userInvestmentRemark, 'now()');
        } else {
            // 第一次投资，可以获得参与 tbg1 空投，新用户空投 100，推荐人空投 50, 只空投前 300,000 个UE账号
            // 如果新用户是在绑定后 48h 内投资的，还可获得绑定空投，新用户空投 20，推荐人空投 10, 只空投前 100,000 个UE账号
            const { bindData, tbg2Data, tshIncomeData } = await investAirdrop(client, accountName, accountInfo.create_time);
            psBindData = bindData;
            psTbg2Data = tbg2Data;
            psTshIncomeData = tshIncomeData;
        }

        // 分配用户投资时全球合伙人和全球合伙人的推荐人收益
        await globalPartnerIncome(accountInfo, globalAccount, userInvestmentRemark, accountOpType);

        // 获取系统账户
        let systemAccount = await getSystemAccountInfo();
        // logger.debug("systemAccount: ", systemAccount);
        // 分配直接推荐奖金
        await investReward(client, amount, accountName, referrerAccountList, systemAccount, userInvestmentRemark);

        // 更新系统池的额度
        for (const item of systemAccount) {
            const income = investAmount.mul(ACCOUNT_RATE.accountRate[item.pool_type] / INVEST_CONSTANT.BASE_RATE);
            const opType = OPT_CONSTANTS.INVITE;
            const remark = `user ${ accountName } participate in tbg_1, add ${ item.pool_type } amount`
            logger.debug("income: %O, item: %O", income, item, ACCOUNT_RATE.accountRate[item.pool_type], INVEST_CONSTANT.BASE_RATE);
            await insertSystemOpLog(client, income.toNumber(), item.pool_amount, { "symbol": UE_TOKEN_SYMBOL, "aid": item.pool_type }, opType, remark, "now()");
            await updateSystemAmount(client, item.pool_type, income, item.pool_amount, UE_TOKEN_SYMBOL);
        }

        // 判断是否参加过 tbg1
        let accountState = ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_2;
        if (accountInfo.state === ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1) {
            accountState = ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1_AND_2
        }
        // 更新用户状态为激活
        if (accountInfo.state !== accountState) {
            await updateAccountState(client, accountState, accountName);
        }

        // 生成子账号
        await addSubAccount(client, accountName, newSubAccount, referrerAccountList);
        // 记录用户操作日志
        await insertAccountOp(client, accountName, accountOpType, userInvestmentRemark);
        await client.query("COMMIT");

        // 发送绑定和参与 tbg2 的消息
        if (Object.keys(psTbg2Data).length !== 0) {
            await psTbg2.pub(psTbg2Data);
            logger.debug(`publish tbg2 message, psTbg1Data: %j`, psTbg2Data);
        }
        
        // 超过 48h 未投资，不空投
        if (Object.keys(psBindData).length !== 0) {
            await psBind.pub(psBindData);
            logger.debug(`publish bind message, psBindData: %j`, psBindData);
        }

        // 分配剩余的资产，发送到 tshincome 处理
        if (Object.keys(psTshIncomeData).length !== 0) {
            await psTshIncome.pub(psTshIncomeData);
            logger.debug(`publish tshincome message, psTshIncomeData: %j`, psTshIncomeData);
        }
    } catch (err) {
        logger.error("allocate user investment assets error, the error stock is %O", err);
        await client.query("ROLLBACK");
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = allocateInvestAsset