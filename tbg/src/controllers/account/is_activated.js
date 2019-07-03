// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/is_activated.js": "帐号是否激活" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountMemberLevel } = require("../../models/account");

// 帐号是否激活
async function isActivated(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: ${ JSON.stringify(reqData) }`);
        logger.info(`get account member level`);
        let rows = await getAccountMemberLevel(reqData.account_name);
        logger.debug(`the account member level is ${ JSON.stringify(rows) }`);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let resDate = get_status(1);
        resDate["data"] = {
            is_activated: rows.member_level
        }

        res.send(resDate);
    } catch (err) {
        throw err
    }
}

module.exports = isActivated;