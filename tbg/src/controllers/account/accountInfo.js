// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/accountInfo.js": "获取当前用户的信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");

// 获取当前用户的信息
async function accountInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of accountInfo is: %j`, reqData);
        let rows = await getAccountInfo(reqData.account_name);
        logger.debug(`the account invest code is %j`, rows);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let resDate = get_status(1);
        resDate["data"] = {
            "account_name": reqData.account_name,
            "account_type": rows.account_type,
            "refer_code": rows.refer_code
        }

        res.send(resDate);
    } catch (err) {
        logger.error("request accountInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = accountInfo;