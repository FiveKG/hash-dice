// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/getAccountMember.js": "get account member" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountMemberLevel } = require("../../models/account");

// 获取当前用户等级
async function getAccountMember(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: ${ reqData }`);
        let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let resData = get_status(1);
        resData["data"] = userMemberLevel.member_level;
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = getAccountMember;