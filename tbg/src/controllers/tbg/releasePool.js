// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/releasePool.js": "线性释放池资料" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { MEMBER_LEVEL_TRX } = require("../../common/constant/assetsConstant.js");
const { RELEASE } = require("../../common/constant/optConstants.js");
const { getAccountInfo, getAccountMemberLevel } = require("../../models/account");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { Decimal } = require("decimal.js");
const { getCurrencyBalance } = require("../../job/getTrxAction.js");
const { userMember } = require("../../common/userMember.js");
const { getTbgBalanceInfo } = require("../../models/tbgBalance");
const { TBG_TOKEN_SYMBOL } = require("../../common/constant/eosConstants");

// 线性释放池资料
async function releasePool(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let userMemberLevel = await getAccountMemberLevel(accountName);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        // 获取用户的 TBG 余额
        const [ balanceInfo ] = await getCurrencyBalance(accountName, accountName, TBG_TOKEN_SYMBOL);
        const levelInfo = userMember(userMemberLevel.count);
        // 获取所有的释放记录
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: RELEASE });
        const tbgBalance = await getTbgBalanceInfo(accountName);
        // 累加释放的资产
        const released = balanceLogInfo.map(it => it.change_amount).reduce((pre, cur) => pre + cur);
        let resData = get_status(1);
        resData["data"] = {
            "releasing": new Decimal(tbgBalance.release_amount).toFixed(8),
            "released": new Decimal(released).toFixed(8),
            "release_rate": MEMBER_LEVEL_TRX[levelInfo.ID].RELEASE_RATE,
            "balance_info": balanceInfo,
            "level": levelInfo.NAME
        }
        res.send(resData);
    } catch (err) {
        logger.error("request releasePool error, the error stock is %O", err);
        throw err;
    }
}

module.exports = releasePool;