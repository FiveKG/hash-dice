// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/is_activated.js": "帐号是否激活" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");

// 帐号是否激活
async function isActivated(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
        logger.info(`get account member level`);
        let accountInfo = await getAccountInfo(reqData.account_name);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let resDate = get_status(1);
        resDate["data"] = {
            is_activated: accountInfo.state
        }

        res.send(resDate);
    } catch (err) {
        throw err
    }
}

module.exports = isActivated;