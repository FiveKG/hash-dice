// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/self_invest.js": "investment by self" });
const { get_status, inspect_req_data, generate_primary_key } = require("../../common/index.js");
const userInvestment = require("../../businessLogic/account/userInvestment.js");
const { getAccountMemberLevel } = require("../../models/account");

// 自己投资
async function investBySelf(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investment by self is: ${ reqData }`);
        if (reqData.amount !== 30) {
            return res.send(get_status(1004, "investment must be 30 EOS"));
        }
        let rows = await getAccountMemberLevel(reqData.account_name);
        logger.debug(`the account member level is ${ JSON.stringify(rows) }`);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        if (rows.member_level !== 1) {
            return res.send(get_status(1013, "this account had activated"));
        }
        let statusCode = await userInvestment(reqData.amount, reqData.account_name);
        res.send(get_status(statusCode));
    } catch (err) {
        throw err
    }
}

module.exports = investBySelf;