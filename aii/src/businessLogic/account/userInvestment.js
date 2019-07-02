// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/models/account/userInvestment.js": "user investment EOS" });
const { Decimal } = require("decimal.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const ACCOUNT_RATE = require("../../common/constant/accountRate.js");
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
 */
async function userInvestment(amount, accountName, userInvestmentRemark) {
    let investAmount = new Decimal(amount);
    // 直接推荐奖励
    let referIncome = investAmount.mul(INVEST_CONSTANT.REFER_INCOME_RATE / INVEST_CONSTANT.BASE_RATE);
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
            throw Error(`lack of system account`);
        }

        if (!investAccount) {
            await client.query("ROLLBACK");
            logger.debug(`the account does not exist`);
            throw Error(`the account does not exist`);
        }

        // 更新用户等级
        if (accountMember && accountMember.member_level === 1) {
            if (accountMember.refer_count >= 50) {
                await updateUserMemberLevel(client, accountName, 3);
            } else {
                await updateUserMemberLevel(client, accountName, 2);
            }
        }

        // 记录用户操作日志
        await client.query(`
            insert into 
                account_op (account_name, op_type, remark, create_time)
                values('${ accountName }', 'investment', '${ userInvestmentRemark }', now());`
        );
        // 用户投资，修改投资后的 amount
        // let investAccountBalance = new Decimal(investAccount.amount);
        // await personalAssetChange(client, accountName, investAccountBalance, amount, userInvestmentRemark);
        let { rows: [ { referrerName } ] } = await client.query(`select referrer_name from referrer where account_name = '${ accountName }'`);
        if (!!referrerName) {
            // 当前投资帐号的推荐人帐号
            let referrerAccount = await getReferrer(accountName);
            // 增加推荐人的 amount
            let referIncomeRemark = `${ userInvestmentRemark }, referrer ${ referrerAccount[0].account_name } add ${ referIncome } UE currency`
            // await personalAssetChange(client, referrerAccount[0].account_name, referIncome, 'invite income', referIncomeRemark, "now()");
            let now = new Date();
            let data = {
                "account_name": referrerAccount[0].account_name,
                "change_amount": referIncome,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": "invite income",
                "remark": referIncomeRemark
            }
            // 存入 redis，待用户点击的时候再收取
            await storeIncome(referrerAccount[0].account_name, "invite", data);
        }
        // 更新系统池的额度
        for (let item of systemAccount) {
            let income = investAmount.mul(ACCOUNT_RATE[item.pool_type] / INVEST_CONSTANT.BASE_RATE);
            let opType = `user investment`;
            let remark = `user investment, add ${ item.pool_type } amount`
            await systemAssetChange(client, item.pool_type, income, item.pool_amount, opType, remark);
            // console.log(investAmount, item, income.toFixed(8));
        }
        await client.query("COMMIT");
        // 生成子账号
        await addSubAccount(client, accountName, amount);
        logger.info("insert ok");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = userInvestment