// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/models/account/userInvestment.js": "user investment EOS" });
const { Decimal } = require("decimal.js");
const rateConstant = require("../../common/constant/rateConstant.js");
const eosConstants = require("../../common/constant/eosConstants");
const { accountRate } = require("../../common/constant/accountRate.js");
const { systemAssetChange, personalAssetChange } = require("../../models/asset");
const { getUserBalance } = require("../../models/balance");
const { getSystemAccountInfo } = require("../../models/systemPool");
const addSubAccount = require("./addSubAccount.js");
const { getAccountMemberLevel, updateUserMemberLevel, getReferrer } = require("../../models/account");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");

/**
 * 用户投资
 * @param { Number } amount 投资额度， decimal 类型
 * @param { String } accountName 用户的帐号
 * @param { String } userInvestmentRemark remark
 * @returns { Promise<Number> }
 */
async function userInvestment(amount, accountName, userInvestmentRemark) {
    // 投资额为 30, 否则不符
    if (amount !== Number(eosConstants.BASE_AMOUNT)) {
        return 1004;
    }
    let member = await getAccountMemberLevel(accountName);
    logger.debug(`the account member level is %j`, member);
    // 帐号不存在
    if (!member) {
        logger.debug(`the account does not exist`);
        return 1001;
    }
    // 已激活
    if (member.member_level !== 1) {
        logger.debug(`the account had activated`);
        return 1013
    }
    let investAmount = new Decimal(amount);
    // 投资大于三十时， 每 30 EOS 生成一个子帐号
    let count = Math.floor(investAmount.div(eosConstants.BASE_AMOUNT).toNumber());
    // 直接推荐奖励
    let referIncome = investAmount.mul(rateConstant.REFER_INCOME_RATE / rateConstant.BASE_RATE);
    let client = await pool.connect();
    await client.query("BEGIN");
    try {
        // 系统账户
        let systemAccount = await getSystemAccountInfo();
        // 当前投资帐号
        let investAccount = await getUserBalance(accountName);
        let accountMember = await getAccountMemberLevel(accountName);
        if (systemAccount.length < 8) {
            await client.query("ROLLBACK");
            logger.debug(`lack of system account`);
            return  1003;
        }

        if (!investAccount) {
            await client.query("ROLLBACK");
            logger.debug(`the account does not exist`);
            return 1001;
        }

        if (accountMember && accountMember.member_level === 1) {
            if (accountMember.refer_count >= 50) {
                await updateUserMemberLevel(client, accountName, 3);
            } else {
                await updateUserMemberLevel(client, accountName, 2);
            }
        }

        await client.query(`
            insert into 
                account_op (account_name, op_type, remark, create_time)
                values('${ accountName }', 'investment', '${ userInvestmentRemark }', now());`
        );
        // 用户投资，修改投资后的 amount
        // let investAccountBalance = new Decimal(investAccount.amount);
        // await personalAssetChange(client, accountName, investAccountBalance, amount, userInvestmentRemark);
        let { rows } = await pool.query(`select referrer_name from referrer where account_name = '${ accountName }'`);
        if (rows[0].referrer_name !== null) {
            // 当前投资帐号的推荐人帐号
            let referrerAccount = await getReferrer(accountName);
            // 增加推荐人的 amount
            let referIncomeRemark = `${ userInvestmentRemark }, referrer ${ referrerAccount[0].account_name } add ${ referIncome } EOS currency`
            // await personalAssetChange(client, referrerAccount[0].account_name, referIncome, 'invite income', referIncomeRemark, "now()");
            let now = new Date();
            let data = {
                "account_name": referrerAccount[0].account_name,
                "change_amount": referIncome,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": "invite income",
                "remark": referIncomeRemark
            }
            await storeIncome(referrerAccount[0].account_name, "invite", data);
        }
        for (let item of systemAccount) {
            let income = investAmount.mul(accountRate[item.pool_type] / rateConstant.BASE_RATE);
            let opType = `user investment`;
            let remark = `user investment, add ${ item.pool_type } amount`
            await systemAssetChange(client, item.pool_type, income, item.pool_amount, opType, remark);
            // console.log(investAmount, item, income.toFixed(8));
        }
        await client.query("COMMIT");
        await addSubAccount(client, accountName, count, amount);
        logger.info("insert ok");
        return 1;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
}

module.exports = userInvestment