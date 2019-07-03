// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/self_invest.js": "investment by self" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const userInvestment = require("../../businessLogic/account/userInvestment.js");
const { getAccountMemberLevel } = require("../../models/account");

// 自己投资
async function investBySelf(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investment by self is: ${ reqData }`);
        if (reqData.amount !== INVEST_CONSTANT.INVEST_AMOUNT) {
            return res.send(get_status(1004, `investment must be ${ INVEST_CONSTANT.INVEST_AMOUNT } UE`));
        }
        let rows = await getAccountMemberLevel(reqData.account_name);
        logger.debug(`the account member level is ${ JSON.stringify(rows) }`);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        if (rows.member_level !== 1) {
            return res.send(get_status(1013, "this account had activated"));
        }
        const remark = `user ${ reqData.account_name } investment ${ reqData.amount } UE`
        await userInvestment(reqData.amount, reqData.account_name, remark);
        res.send(get_status(1));
    } catch (err) {
        throw err
    }
}

module.exports = investBySelf;