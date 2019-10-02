// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "直接推荐奖励" });
const { Decimal } = require("decimal.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");
const { allocateSurplusAssets } = require("../systemPool");
const { pool } = require("../../db");
const { getAccountMemberLevel } = require("../../models/account");

/**
 * 直接推荐奖励
 * @param { any } client
 * @param { number } amount 投资额度， decimal 类型
 * @param { String } accountName 用户的帐号
 * @param { String[] } referrerAccountList 子账号
 * @param { DB.SystemPools[] } systemAccount 
 * @param { String } userInvestmentRemark remark
 */
async function investReward(client, amount, accountName, referrerAccountList, systemAccount, userInvestmentRemark) {
    let investAmount = new Decimal(amount);
    // 直接推荐奖励
    let referIncome = investAmount.mul(INVEST_CONSTANT.REFER_INCOME_RATE / INVEST_CONSTANT.BASE_RATE);
    try {
        // 分配直接推荐奖金
        // 每推荐1名有效会员则享有一层直接推荐奖励，以此类推，九层封顶
        // 全球合伙人推荐全球合伙人，推荐者均可获得被推荐的全球合伙人伞下直接推荐奖励，是接续非断开的
        let count = 1;
        let distributed = new Decimal(0);
        for (const referrer of referrerAccountList) {
            if (referrer === '' || referrer === accountName) {
                continue;
            }
            const rate = setRate(count);
            const income = referIncome.mul(rate);
            const { count: inviteCount } = await getAccountMemberLevel(referrer);
            // 如果用户推荐的有效人数大于等于可分配的层级，用户即可获得层级奖励
            if (inviteCount >= count) {
                distributed.add(income);
                // 增加推荐人的 amount
                let referIncomeRemark = `${ userInvestmentRemark }, referrer ${ referrer } add ${ income } UE currency`
                let now = new Date();
                let data = {
                    "account_name": referrer,
                    "change_amount": income,
                    "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                    "op_type": OPT_CONSTANTS.INVITE,
                    "extra": { "symbol": UE_TOKEN_SYMBOL },
                    "remark": referIncomeRemark
                }
                // 存入 redis，待用户点击的时候再收取
                await storeIncome(referrer, OPT_CONSTANTS.INVITE, data);
            }
            
            // 只分配九层
            if (count >= 9) {
                return;
            } else {
                count++;
            }
        }

        // 分配剩余的收益
        if (!referIncome.div(distributed).lessThanOrEqualTo(0)) {
            await allocateSurplusAssets(client, systemAccount, referIncome, distributed, OPT_CONSTANTS.INVITE);
        }
    } catch (err) {
        logger.error("allocate user investment assets error, the error stock is %O", err);
        throw err;
    }
}

/**
 * 设置分配比例
 * @param { number } position 
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
    } else {
        return INCOME_CONSTANT.REFER_NINTH_LEVEL / INCOME_CONSTANT.BASE_RATE;
    } 
}

module.exports = investReward