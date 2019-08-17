// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/show_account_name_by_code.js": "显示邀请邀请码对应帐号" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { ACCOUNT_TYPE, INVITE_CODE, INVITE_CODE_KEY } = require("../../common/constant/accountConstant.js");

// 显示邀请邀请码对应帐号
async function showAccountNameByCode(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of showAccountNameByCode is: %j`, reqData);
        logger.info(`transaction begin`);
        let investCode = reqData.refer_code;
        let account_name = "";
        let resDate = get_status(1);
        if (investCode === INVITE_CODE.GENERAL || investCode === INVITE_CODE.GLOBAL) {
            account_name = "系统将随机分配您的邀请人"
            resDate["data"] = {
                account_name: account_name
            }

            return res.send(resDate);
        }

        let selectAccountNameSql = `
            select account_name from account where refer_code = ${ investCode };
        `
        logger.debug(`find the account_name by invitation code`);
        let { rows: [ accountName ] } = await pool.query(selectAccountNameSql);
        if (!accountName) {
            return res.send(get_status(1001, "this account does not exists"));    
        }
        
        resDate["data"] = {
            account_name: accountName.account_name
        }
        res.send(resDate);
    } catch (err) {
        logger.error("request showAccountNameByCode error, the error stock is %O", err);
        throw err;
    }
}

module.exports = showAccountNameByCode;