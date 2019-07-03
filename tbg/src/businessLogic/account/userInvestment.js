// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/models/account/userInvestment.js": "user investment EOS" });
const { Decimal } = require("decimal.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const ACCOUNT_RATE = require("../../common/constant/accountRate.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount } = require("../../models/systemPool");
const { getUserBalance } = require("../../models/balance");
const { insertAccountOp } = require("../../models/accountOp");
const { getSystemAccountInfo } = require("../../models/systemPool");
const addSubAccount = require("./addSubAccount.js");
const { getAllParentLevel } = require("../../models/account");
const storeIncome = require("../../common/storeIncome.js");
const { allocateSurplusAssets } = require("../systemPool");
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
        // 当前投资帐号
        let investAccount = await getUserBalance(accountName);
        if (!investAccount) {
            logger.debug(`the account does not exist`);
            throw Error(`the account does not exist`);
        }

        // 记录用户操作日志
        await insertAccountOp(client, accountName, 'investment', userInvestmentRemark)
        
        let referrerAccountList = await getAllParentLevel(accountName);
        console.debug("referrerAccountList: ", referrerAccountList);
        if (referrerAccountList.length === 0) {
            console.warn("没有推荐关系，请先设置推荐关系，检查数据是否正确");
            throw Error("没有推荐关系，请先设置推荐关系，检查数据是否正确");
        }

        let count = 1;
        let distributed = new Decimal(0);
        for (const referrer of referrerAccountList) {
            if (referrer === '' || referrer === accountName) {
                continue;
            }
            const rate = setRate(count);
            const income = referIncome.mul(rate);
            distributed.add(income);
            // 增加推荐人的 amount
            let referIncomeRemark = `${ userInvestmentRemark }, referrer ${ referrer } add ${ income } UE currency`
            let now = new Date();
            let data = {
                "account_name": referrer,
                "change_amount": income,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": "invite income",
                "remark": referIncomeRemark
            }
            // 存入 redis，待用户点击的时候再收取
            await storeIncome(referrer, "invite", data);
            if (count === 9) {
                return;
            } else {
                count++;
            }
        }

        count = null;

        // 系统账户
        let systemAccount = await getSystemAccountInfo();
        console.debug("systemAccount: ", systemAccount);
        if (systemAccount.length < 8) {
            logger.debug(`lack of system account`);
            throw Error(`lack of system account`);
        }
        
        await allocateSurplusAssets(client, systemAccount, referIncome, distributed, "referrer");
        // 更新系统池的额度
        for (const item of systemAccount) {
            const income = investAmount.mul(ACCOUNT_RATE[item.pool_type] / INVEST_CONSTANT.BASE_RATE);
            const opType = `user investment`;
            const remark = `user investment, add ${ item.pool_type } amount`
            await insertSystemOpLog(client, income, item.pool_amount, opType, remark);
            await updateSystemAmount(client, item.pool_type, income, item.pool_amount);
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

/**
 * 设置分配比例
 * @param { Number } position 
 */
function setRate(position) {
    if (position === 1) {
        return INCOME_CONSTANT.REFER_FIRST_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 2) {
        return INCOME_CONSTANT.REFER_SECOND_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 3) {
        return INCOME_CONSTANT.REFER_THIRD_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 4) {
        return INCOME_CONSTANT.REFER_FOURTH_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 5) {
        return INCOME_CONSTANT.REFER_FIFTH_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 6) {
        return INCOME_CONSTANT.REFER_SIXTH_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 7) {
        return INCOME_CONSTANT.REFER_SEVENTH_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 8) {
        return INCOME_CONSTANT.REFER_EIGHTH_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } else if (position === 9) {
        return INCOME_CONSTANT.REFER_NINTH_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } 
}

module.exports = userInvestment