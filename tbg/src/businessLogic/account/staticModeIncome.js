// @ts-check
const { getStaticMode } = require("../../models/account");
const { Decimal } = require("decimal.js");
const { BASE_RATE, MODE_INCOME_RATE} = require("../../common/constant/investConstant.js");
const MODE_CONSTANT = require("../../common/constant/staticModeConstants.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "三三分配" });
const storeIncome = require("../../common/storeIncome.js");
const { allocateSurplusAssets } = require("../systemPool");
const { getMainAccountBySub } = require("../../models/subAccount");
const df = require("date-fns");
const { pool } = require("../../db/index.js");

/**
 * 三三静态收益分配
 * @param { number } amount 三三静态收益
 * @param { String } subAccount
 */
async function staticMode(amount, subAccount) {
    try {
        // 用户投资时， 三三静态可分配额度
        let modeEnable = new Decimal(amount).mul(MODE_INCOME_RATE / BASE_RATE);
        let modeList = await getStaticMode(subAccount);
        if (!modeList) {
            return
        }

        // 收益从当前子账号往上算
        modeList.reverse();
        logger.debug(`modeEnable: ${ modeEnable }`);
        const len = modeList.length;
        if (len > 51) {
            modeList = modeList.splice(0, 51);
        }

        // 去除当前生成的子帐号，新生成的需要等一个用户投资才有收益
        const subMap = new Map();
        let distributed = new Decimal(0);
        logger.debug(`modeList: `, modeList);
        for (let i = 1; i < modeList.length; i++) {
            const rate = setRate(i);
            const availableIncome = modeEnable.mul(rate);
            distributed = distributed.add(availableIncome);
            const remark = `subAccount ${ subAccount }, income ${ availableIncome }, level ${ i }`;
            const now = new Date();
            const data = {
                "account_name": '',
                "change_amount": availableIncome,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": OPT_CONSTANTS.MODE,
                "extra": { "symbol": UE_TOKEN_SYMBOL },
                "remark": remark
            }
            subMap.set(modeList[i], data);
        }
        
        const subAccountInfo = await getMainAccountBySub(modeList);
        logger.debug(`subAccountInfo: `, subAccountInfo);
        for (let i = 0; i < subAccountInfo.length; i++) {
            const data = subMap.get(subAccountInfo[i].sub_account_name)
            if (!!data) {
                const mainAccount = subAccountInfo[i].main_account;
                data.account_name = mainAccount;
                // 将收益暂存，等待用户收取
                await storeIncome(mainAccount, OPT_CONSTANTS.MODE, data);
            }            
        }

        // 低于 51 层，剩余的部分分配给社区、开发
        if (len < 51) {
            // 减去已经发放的
            const last = modeEnable.minus(distributed);
            if (!last.lessThanOrEqualTo(0)) {
                await allocateSurplusAssets(pool, modeEnable, distributed, OPT_CONSTANTS.MODE)
            }
        }
    } catch (err) {
        logger.error("allocating static mode income error, the error stock is %O", err);
        throw err
    }
}

/**
 * 设置分配比例
 * @param { number } position 
 */
function setRate(position) {
    if (position === 1) {
        return MODE_CONSTANT.FIRST / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 2) {
        return MODE_CONSTANT.SECOND / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 3) {
        return MODE_CONSTANT.THIRD / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 4) {
        return MODE_CONSTANT.FOURTH / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 5) {
        return MODE_CONSTANT.FIFTH / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 6) {
        return MODE_CONSTANT.SIXTH / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 7) {
        return MODE_CONSTANT.SEVENTH / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 8) {
        return MODE_CONSTANT.EIGHTH / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 9) {
        return MODE_CONSTANT.NINTH / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position === 10) {
        return MODE_CONSTANT.TENTH / MODE_CONSTANT.STATIC_MODE_BASE;
    } else if (position <= 30) {
        return MODE_CONSTANT.NEXT_TWENTY / MODE_CONSTANT.STATIC_MODE_BASE / (position - 10);
    } else {
        return MODE_CONSTANT.LAST_TWENTY / MODE_CONSTANT.STATIC_MODE_BASE / (position - 30);
    }
}

module.exports = staticMode;