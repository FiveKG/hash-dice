// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/friend_invest.js": "help friends invest" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const userInvestment = require("../../businessLogic/account/userInvestment.js");
const { getUserBalance } = require("../../models/balance");
const { userWithdraw } = require("../../models/asset");
const { Decimal } = require("decimal.js");
const { getAccountInfo } = require("../../models/account");
const { ACCOUNT_INACTIVATED } = require("../../common/constant/accountConstant.js")
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");

// 帮朋友投资
async function friendInvest(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investment by self is: %j`, reqData);
        let friendAccount = reqData.accountName;
        let rows = await getUserBalance(reqData.account_name);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let accountInfo = await getAccountInfo(reqData.account_name);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        if (accountInfo.state !== ACCOUNT_INACTIVATED) {
            return res.send(get_status(1013, "this account had activated"));
        }
        
        let userBalance = new Decimal(rows.withdraw_enable);
        // 检查余额是否足够
        if (userBalance.lessThan(INVEST_CONSTANT.INVEST_AMOUNT)) {
            return res.send(get_status(1011, "insufficient balance"));
        }
        let remark = `user ${ reqData.account_name } help user ${ friendAccount } invest ${ INVEST_CONSTANT.INVEST_AMOUNT } UE`
        let changeAmount = new Decimal(-INVEST_CONSTANT.INVEST_AMOUNT);
        // 修改帮投资的余额
        await userWithdraw(pool, reqData.account_name, changeAmount, 'invest income',remark);
        // 投资
        await userInvestment(reqData.amount, friendAccount, remark);
        res.send(get_status(1));
    } catch (err) {
        throw err
    }
}

module.exports = friendInvest;