// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/self_invest.js": "investment by self" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");
const userInvestment = require("../../businessLogic/account/userInvestment.js");
const { getAccountInfo } = require("../../models/account");
const { ACCOUNT_INACTIVATED } = require("../../common/constant/accountConstant.js")

// 自己投资
async function investBySelf(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investment by self is: %j`, reqData);
        if (reqData.amount !== INVEST_CONSTANT.INVEST_AMOUNT) {
            return res.send(get_status(1004, `investment must be ${ INVEST_CONSTANT.INVEST_AMOUNT } UE`));
        }
        let accountInfo = await getAccountInfo(reqData.account_name);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        // 未激活状态为 0
        if (accountInfo.state !== ACCOUNT_INACTIVATED) {
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