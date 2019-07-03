// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/team/invite.js": "look up invite account" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAllInviteAccount, getReferrer } = require("../../models/account");

// 直接邀请的用户
async function invite(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investment by self is: ${ reqData }`);
        let rows = await getAllInviteAccount(reqData.account_name);
        let activated = [];
        let inActivated = [];
        let len = rows.length;
        if (len) {
            for (let i = 0; i < len; i++) {
                let temp = rows[i]
                if (temp.member_level === 1) {
                    inActivated.push(temp.account_name);
                } else {
                    activated.push(temp.account_name);
                }
            }
        }

        let result = await getReferrer(reqData.account_name);
        if (!result.length) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let resData = get_status(1);
        resData["data"] = {
            referrer_account: result[0].account_name,
            referrer_code: result[0].refer_code,
            activated: activated,
            inActivated: inActivated
        }
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = invite;