// @ts-check
const { pool, psTbg1, psBind } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/models/account/userInvestment.js": "user investment" });
const { Decimal } = require("decimal.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const ACCOUNT_RATE = require("../../common/constant/accountRate.js");
const ACCOUNT_CONSTANT = require("../../common/constant/accountConstant.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount, getSystemAccountInfo } = require("../../models/systemPool");
const { insertAccountOp } = require("../../models/accountOp");
const addSubAccount = require("./addSubAccount.js");
const { getAllParentLevel, updateAccountState, getAccountInfo } = require("../../models/account")
const handleRepeat = require("./handleRepeat.js");
const investAirdrop = require("./investAirdrop.js");
const investReward = require("./investReward.js");

/**
 * 用户投资
 * @param { number } amount 投资额度， decimal 类型
 * @param { String } accountName 用户的帐号
 * @param { String } newSubAccount 子账号
 * @param { String } userInvestmentRemark remark
 */
async function allocateInvestAsset(amount, accountName, newSubAccount, userInvestmentRemark) {
    let investAmount = new Decimal(amount);
    let client = await pool.connect();
    await client.query("BEGIN");
    try {
        // 先检查是否存在推荐关系
        let referrerAccountList = await getAllParentLevel(accountName);
        logger.debug("referrerAccountList: ", referrerAccountList);
        if (referrerAccountList.length === 0) {
            logger.warn("没有推荐关系，请先设置推荐关系，检查数据是否正确");
            throw Error("没有推荐关系，请先设置推荐关系，检查数据是否正确");
        }

        let psBindData = {};
        let psTbg1Data = {};
        let psTshIncomeData = {};
        const accountInfo = await getAccountInfo(accountName);
        let accountOpType = OPT_CONSTANTS.INVITE;
        // 如果之前参加过,则是复投, 复投全球合伙人可得复投额度的 1%, 全球合伙人的推荐人可得复投额度的 0.5%
        if (accountInfo.state === 10 || accountInfo.state === 30) {
            accountOpType = OPT_CONSTANTS.REPEAT;
            // 用户复投
            const globalAccount = referrerAccountList[1];
            psTshIncomeData = await handleRepeat(client, accountInfo, globalAccount, userInvestmentRemark);
        } else {
            // 第一次投资，可以获得参与 tbg1 空投，新用户空投 100，推荐人空投 50, 只空投前 300,000 个UE账号
            // 如果新用户是在绑定后 48h 内投资的，还可获得绑定空投，新用户空投 20，推荐人空投 10, 只空投前 100,000 个UE账号
            const { bindData, tbg1Data, tshIncomeData } = await investAirdrop(client, accountName, accountInfo.create_time);
            psBindData = bindData;
            psTbg1Data = tbg1Data;
            psTshIncomeData = tshIncomeData;
        }

        // 获取系统账户
        let systemAccount = await getSystemAccountInfo();
        logger.debug("systemAccount: ", systemAccount);
        if (systemAccount.length < 8) {
            logger.debug(`lack of system account`);
            throw Error(`lack of system account`);
        }

        // 分配直接推荐奖金
        await investReward(client, amount, accountName, referrerAccountList, systemAccount, userInvestmentRemark);

        // 更新系统池的额度
        for (const item of systemAccount) {
            const income = investAmount.mul(ACCOUNT_RATE.accountRate[item.pool_type] / INVEST_CONSTANT.BASE_RATE);
            const opType = OPT_CONSTANTS.INVITE;
            const remark = `user ${ accountName } participate in tbg_1, add ${ item.pool_type } amount`
            logger.debug("income: %O, item: %O", income, item, ACCOUNT_RATE.accountRate[item.pool_type], INVEST_CONSTANT.BASE_RATE);
            await insertSystemOpLog(client, income.toNumber(), item.pool_amount, {}, opType, remark, "now()");
            await updateSystemAmount(client, item.pool_type, income, item.pool_amount);
        }
        // 更新用户状态为激活
        await updateAccountState(client, ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1, accountName);
        // 生成子账号
        await addSubAccount(client, accountName, newSubAccount, referrerAccountList);
        // 记录用户操作日志
        await insertAccountOp(client, accountName, accountOpType, userInvestmentRemark);
        await client.query("COMMIT");

        // 发送绑定和参与 tbg1 的消息
        await psTbg1.pub(psTbg1Data);
        logger.debug(`publish tbg1 message, psTbg1Data: %j`, psTbg1Data);
        // 超过 48h 未投资，不空投
        if (Object.keys(psBindData).length === 0) {
            await psBind.pub(psBindData);
            logger.debug(`publish bind message, psBindData: %j`, psBindData);
        }

        // 分配剩余的资产，发送到 tshincome 处理
        if (Object.keys(psTshIncomeData).length === 0) {
            await psBind.pub(psTshIncomeData);
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