// @ts-check
const { pool } = require("../../db");
const { getStaticMode } = require("../../models/account");
const { Decimal } = require("decimal.js");
const { BASE_RATE, MODE_INCOME_RATE} = require("../../common/constant/investConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js");
const { DEV_OP_POOL, COMMUNITY_POOL } = require("../../common/constant/accountConstant.js");
const MODE_CONSTANT = require("../../common/constant/staticModeConstants.js");
const { personalAssetChange, systemAssetChange } = require("../../models/asset");
const { getOneAccount } = require("../../models/systemPool");
const logger = require("../../common/logger.js");
const storeIncome = require("../../common/storeIncome.js");
const df = require("date-fns");

/**
 * 三三静态收益分配
 * @param { any } client
 * @param { Number } amount 三三静态收益
 */
async function staticMode(client, amount, subAccount) {
    try {
        // 用户投资时， 三三静态可分配额度
        let modeEnable = new Decimal(amount).mul(MODE_INCOME_RATE / BASE_RATE);
        let rows = await getStaticMode(subAccount);
        let modeList = rows.account;
        let len = modeList.length;
        if (!len) {
            return
        }

        modeList.reverse();
        logger.debug(`modeEnable: ${ modeEnable }, modeList: ${ modeList }`);
        if (len > 50) {
            modeList = modeList.splice(0, 51);
        }

        let distributed = new Decimal(0);
        for (let i = 1; i < modeList.length; i++) {
            let  availableIncome = await beginDistr(client, modeEnable, modeList[i], i);
            distributed = distributed.add(availableIncome);
        }

        if (modeList.length < 51) {
            let devAccount = await getOneAccount(DEV_OP_POOL);
            let communityAccount = await getOneAccount(COMMUNITY_POOL);
            if (!devAccount) {
                logger.debug(`system account ${ DEV_OP_POOL } not found`);
                return;
            }
            if (!communityAccount) {
                logger.debug(`system account ${ COMMUNITY_POOL } not found`);
                return
            }
            // 减去已经发放的
            let last = modeEnable.minus(distributed);
            let devRemark = `distribution sort income, add ${ DEV_OP_POOL } ${ last.mul(INCOME_CONSTANT.DEV_INCOME / INCOME_CONSTANT.BASE_RATE) } amount`;
            let communityRemark = `distribution sort income, add ${ COMMUNITY_POOL } ${ last.mul(INCOME_CONSTANT.COMMUNITY_INCOME / INCOME_CONSTANT.BASE_RATE) } amount`;
            logger.debug(`distributed: ${ distributed }, last: ${ last }`);
            await systemAssetChange(client, DEV_OP_POOL, last.mul(INCOME_CONSTANT.DEV_INCOME / INCOME_CONSTANT.BASE_RATE), devAccount.pool_amount, 'sort last', devRemark);
            await systemAssetChange(client, COMMUNITY_POOL, last.mul(INCOME_CONSTANT.COMMUNITY_INCOME / INCOME_CONSTANT.BASE_RATE), communityAccount.pool_amount, 'sort last', communityRemark);
        }
    } catch (err) {
        throw err
    }
}

/**
 * 设置分配比例
 * @param { Number } position 
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

/**
 * 
 * @param { any } client 
 * @param { Decimal } modeEnable 
 * @param { String } subAccount 
 * @param { Number } position 
 */
async function beginDistr(client, modeEnable, subAccount, position) {
    let rate = setRate(position);
    let availableIncome = modeEnable.mul(rate);
    let mainAccount = await getStaticModeMainAccount(subAccount);
    let opType = `mode income`;
    let remark = `subAccount ${ subAccount }, income ${ availableIncome }, level ${ position }`;
    let now = new Date();
    let data = {
        "account_name": mainAccount.main_account,
        "change_amount": availableIncome,
        "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
        "op_type": opType,
        "remark": remark
    }
    await storeIncome(mainAccount.main_account, "mode", data);
    // await personalAssetChange(client, mainAccount.main_account, availableIncome, opType, remark);
    return availableIncome;
}

/**
 * 查找三三排位子帐号对应的主帐号
 * @param { String } subAccount 子帐号
 */
async function getStaticModeMainAccount(subAccount) {
    try {
        let sql = `
            select s.main_account, b.amount from sub_account s 
                join balance b on s.main_account = b.account_name 
                where s.sub_account_name = '${ subAccount }';`
        let { rows } = await pool.query(sql);
        // console.log("rows: ", rows[0]);
        return rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = staticMode;