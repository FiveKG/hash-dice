// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取每日签到信息" });
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

// 获取每日签到信息
async function checkInDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        // 获取签到信息
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: OPT_CONSTANTS.CHECK_IN });
        logger.debug("balanceLogInfo: ", balanceLogInfo);
        // 如果有的话，直接看第一条的内容，change_amount 就是最新签到所得，create_time 为最新签到日期
        let changeAmount = 0;
        if (balanceLogInfo.length !== 0) {
            if (df.isToday(balanceLogInfo[0].create_time) || df.isYesterday(balanceLogInfo[0].create_time)) {
                changeAmount = balanceLogInfo[0].change_amount
            } else {
                changeAmount = 0;
            }
        }

        let resData = get_status(1);
        resData["data"] = {
            "detail": [ CHECK_IN_AIRDROP_1, CHECK_IN_AIRDROP_2, 
                CHECK_IN_AIRDROP_3, CHECK_IN_AIRDROP_4,
                CHECK_IN_AIRDROP_5, CHECK_IN_AIRDROP_6, CHECK_IN_AIRDROP_7 ].map(it => {
                    return {
                        "is_check": new Decimal(changeAmount).lessThan(it) ? false : true,
                        "income": it
                    }
                })
        }

        res.send(resData);
    } catch (err) {
        logger.error("request checkInDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkInDetail;