// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/invest_code.js": "获取用户的邀请码" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getInviteCode } = require("../../models/account");

// 获取用户的邀请码
async function investCode(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investCode is: %j`, reqData);
        let rows = await getInviteCode(reqData.account_name);
        logger.debug(`the account invest code is %j`, rows);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let resDate = get_status(1);
        resDate["data"] = {
            invest_code: rows.refer_code,
            account_name: reqData.account_name
        }

        res.send(resDate);
    } catch (err) {
        logger.error("request investCode error, the error stock is %O", err);
        throw err;
    }
}

module.exports = investCode;