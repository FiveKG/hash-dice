// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/friend_invest.js": "help friends invest" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const userInvestment = require("../../businessLogic/account/userInvestment.js");
const { getUserBalance } = require("../../models/balance");
const { userWithdraw } = require("../../models/asset");
const { Decimal } = require("decimal.js");
const { getAccountMemberLevel } = require("../../models/account");
const { BASE_AMOUNT } = require("../../common/constant/eosConstants.js");

// 帮朋友投资
async function friendInvest(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investment by self is: ${ reqData }`);
        let friendAccount = reqData.accountName;
        let rows = await getUserBalance(reqData.account_name);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let member = await getAccountMemberLevel(reqData.account_name);
        logger.debug(`the account member level is ${ member }`);
        if (!member) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        if (member.member_level !== 1) {
            return res.send(get_status(1013, "this account had activated"));
        }
        
        let userBalance = new Decimal(rows.withdraw_enable);
        // 检查余额是否足够
        if (userBalance.lessThan(BASE_AMOUNT)) {
            return res.send(get_status(1011, "insufficient balance"));
        }
        let remark = `user ${ reqData.account_name } help user ${ friendAccount } invest ${ BASE_AMOUNT } EOS`
        let changeAmount = new Decimal(-BASE_AMOUNT);
        // 修改帮投资的余额
        await userWithdraw(pool, reqData.account_name, changeAmount, 'invest income',remark);
        // 投资
        let statusCode = await userInvestment(reqData.amount, friendAccount, remark);
        res.send(get_status(statusCode));
    } catch (err) {
        throw err
    }
}

module.exports = friendInvest;