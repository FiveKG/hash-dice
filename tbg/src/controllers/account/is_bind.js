// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/is_bind.js": "帐号是否已经绑定" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 帐号是否已经绑定
async function isBind(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of isBind is: %j`, reqData);
        logger.info(`get account bind info`);
        let selectSql = `
             select r.referrer_name, r.account_name 
                from referrer r 
                join account a on a.account_name = r.account_name 
                where r.account_name = '${ reqData.account_name }';
        `
        let { rows } = await pool.query(selectSql);
        logger.debug(`the account info is %O`, rows[0]);
        if (!rows[0]) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let resDate = get_status(1);
        resDate["data"] = {
            is_bind: true
        }

        res.send(resDate);
    } catch (err) {
        logger.error("request isBind error, the error stock is %O", err);
        throw err;
    }
}

module.exports = isBind;