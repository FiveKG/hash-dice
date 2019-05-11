// @ts-check
const { pool } = require("../../db");
const { getStaticMode } = require("../../models/account");
const { Decimal } = require("decimal.js");
const { BASE_RATE, MODE_INCOME_RATE} = require("../../common/constant/rateConstant.js");
const { DEV_OP_POOL, COMMUNITY_POOL } = require("../../common/constant/accountConstant.js");
const modeConstants = require("../../common/constant/staticModeConstants.js");
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
            let devRemark = `distribution sort income, add ${ DEV_OP_POOL } ${ last.mul(40 / 100) } amount`;
            let communityRemark = `distribution sort income, add ${ COMMUNITY_POOL } ${ last.mul(60 / 100) } amount`;
            logger.debug(`distributed: ${ distributed }, last: ${ last }`);
            await systemAssetChange(client, DEV_OP_POOL, last.mul(40 / 100), devAccount.pool_amount, 'sort last', devRemark);
            await systemAssetChange(client, COMMUNITY_POOL, last.mul(60 / 100), communityAccount.pool_amount, 'sort last', communityRemark);
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
        return modeConstants.FIRST / modeConstants.STATIC_MODE_BASE;
    } else if (position === 2) {
        return modeConstants.SECOND / modeConstants.STATIC_MODE_BASE;
    } else if (position === 3) {
        return modeConstants.THIRD / modeConstants.STATIC_MODE_BASE;
    } else if (position === 4) {
        return modeConstants.FOURTH / modeConstants.STATIC_MODE_BASE;
    } else if (position === 5) {
        return modeConstants.FIFTH / modeConstants.STATIC_MODE_BASE;
    } else if (position === 6) {
        return modeConstants.SIXTH / modeConstants.STATIC_MODE_BASE;
    } else if (position === 7) {
        return modeConstants.SEVENTH / modeConstants.STATIC_MODE_BASE;
    } else if (position === 8) {
        return modeConstants.EIGHTH / modeConstants.STATIC_MODE_BASE;
    } else if (position === 9) {
        return modeConstants.NINTH / modeConstants.STATIC_MODE_BASE;
    } else if (position === 10) {
        return modeConstants.TENTH / modeConstants.STATIC_MODE_BASE;
    } else if (position <= 30) {
        return modeConstants.NEXT_TWENTY / modeConstants.STATIC_MODE_BASE / (position - 10);
    } else {
        return modeConstants.LAST_TWENTY / modeConstants.STATIC_MODE_BASE / (position - 30);
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