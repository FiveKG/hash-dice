// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取用户的推荐人" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAllInviteAccount, getReferrer } = require("../../models/account");

// 获取用户的推荐人
async function getAccountReferrer(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
        let referrerInfo = await getReferrer(reqData.account_name);
        let refAccount = '';
        if (!!referrerInfo) {
            refAccount = referrerInfo.account_name;
        }
        
        let resData = get_status(1);
        resData["data"] = {
            referrer_account: refAccount
        }
        res.send(resData);
    } catch (err) {
        logger.error("request getAccountReferrer error, the error stock is %O", err);
        throw err
    }
}

module.exports = getAccountReferrer;