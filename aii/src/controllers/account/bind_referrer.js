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
        let inviteCode = reqData.refer_code;
        let selectAccountNameSql = ``;
        // 如果邀请码是 "000000", 随机分配一个存在的帐号作为邀请人
        if (inviteCode === "000000") {
            selectAccountNameSql = `select account_name from account order by random() limit 1;`
        } else {
            inviteCode = parseInt(inviteCode)
            selectAccountNameSql = `
                select account_name from account where refer_code = ${ inviteCode };
            `
        }
        let { rows } = await pool.query(selectAccountNameSql);
        if (!rows.length) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let remark = `user ${ rows[0].account_name } invites ${ reqData.account_name }`;
        await setReferrer(pool, rows[0].account_name, reqData.account_name, remark, false);
        res.send(get_status(1));
    } catch (err) {
        throw err
    }
}

module.exports = bindReferrer;