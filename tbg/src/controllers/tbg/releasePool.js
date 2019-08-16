// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/releasePool.js": "线性释放池资料" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { CHECK_IN_AIRDROP_ID } = require("../../common/constant/tbgAllocateRate");
const { MEMBER_LEVEL_TRX } = require("../../common/constant/assetsConstant.js");
const { getAccountInfo, getAccountMemberLevel } = require("../../models/account");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { Decimal } = require("decimal.js");
const { userMember } = require("../../common/userMember.js");
const { getTbgBalanceInfo } = require("../../models/tbgBalance");


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

        let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        const levelInfo = userMember(userMemberLevel.count);
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: CHECK_IN_AIRDROP_ID });
        const tbgBalance = await getTbgBalanceInfo(accountName);

        let resData = get_status(1);
        resData["data"] = {
            "releasing": new Decimal(tbgBalance.release_amount).toFixed(8),
            "released": new Decimal(balanceLogInfo[0].current_balance).toFixed(8),
            "release_rate": MEMBER_LEVEL_TRX[levelInfo.ID].RELEASE_RATE,
            "level": levelInfo.NAME
        }
        res.send(resData);
    } catch (err) {
        logger.error("request releasePool error, the error stock is %O", err);
        throw err;
    }
}

module.exports = releasePool;