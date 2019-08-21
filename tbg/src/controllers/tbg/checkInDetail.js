// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/checkInInfo.js": "获取签到奖励明细" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { 
    CHECK_IN_AIRDROP_1,
    CHECK_IN_AIRDROP_2, CHECK_IN_AIRDROP_3,
    CHECK_IN_AIRDROP_4, CHECK_IN_AIRDROP_5,
    CHECK_IN_AIRDROP_6, CHECK_IN_AIRDROP_7
 } = require("../../common/constant/tbgAllocateRate");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { getAccountInfo } = require("../../models/account");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { Decimal } = require("decimal.js");
const df = require("date-fns");

// 获取签到奖励明细
async function checkInDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: OPT_CONSTANTS.CHECK_IN });
        const createTime = !!balanceLogInfo[0] ? balanceLogInfo[0].create_time : new Date(1970, 0, 1);
        const changeAmount = !!balanceLogInfo[0] ? balanceLogInfo[0].change_amount : 0;
        let resData = get_status(1);
        resData["data"] = {
            "check_in": !!df.isToday(createTime) ? true : false,
            "income": new Decimal(changeAmount).toNumber(),
            "detail": [ CHECK_IN_AIRDROP_1, CHECK_IN_AIRDROP_2, CHECK_IN_AIRDROP_3, CHECK_IN_AIRDROP_4, CHECK_IN_AIRDROP_5, CHECK_IN_AIRDROP_6, CHECK_IN_AIRDROP_7 ]
        }

        res.send(resData);
    } catch (err) {
        logger.error("request checkInDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkInDetail;