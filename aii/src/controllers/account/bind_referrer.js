// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/bind_referrer.js": "bind referrer" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { setReferrer } = require("../../models/account");

// 绑定邀请人
async function bindReferrer(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of bind referrer is: ${ JSON.stringify(reqData) }`);
        logger.info(`transaction begin`);
        let accountName = reqData.account_name;
        let inviteCode = reqData.refer_code;
        let selectAccountNameSql = ``;
        // 如果邀请码是 "000000", 随机分配一个存在的帐号作为邀请人
        if (inviteCode === "000000") {
            selectAccountNameSql = `select account_name from account where account_name not in ('${ accountName }') order by random() limit 1;`
        } else {
            inviteCode = parseInt(inviteCode)
            selectAccountNameSql = `
                select account_name from account where refer_code = ${ inviteCode };
            `
        }
        let { rows } = await pool.query(selectAccountNameSql);
        let referrerName = ``;
        if (!rows.length) {
            referrerName = null;
        } else {
            referrerName = rows[0].account_name;
        }
        let remark = `user ${ referrerName } invites ${ accountName }`;
        await setReferrer(pool, referrerName, accountName, remark, false);
        res.send(get_status(1));
    } catch (err) {
        throw err
    }
}

module.exports = bindReferrer;