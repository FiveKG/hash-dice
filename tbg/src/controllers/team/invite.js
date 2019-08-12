// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/team/invite.js": "look up invite account" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAllInviteAccount, getReferrer } = require("../../models/account");

// 直接邀请的用户
async function invite(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
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

        let referrerInfo = await getReferrer(reqData.account_name);
        let refAccount = '';
        let refCode = '';
        if (!!referrerInfo) {
            refAccount = referrerInfo.account_name;
            refCode = referrerInfo.refer_code;
        }
        
        let resData = get_status(1);
        resData["data"] = {
            referrer_account: refAccount,
            referrer_code: refCode,
            activated: activated,
            inActivated: inActivated
        }
        res.send(resData);
    } catch (err) {
        logger.error("request team invite error, the error stock is %O", err);
        throw err
    }
}

module.exports = invite;