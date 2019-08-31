// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/friend_invest.js": "help friends invest" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const userInvestment = require("../../businessLogic/account/userInvestment.js");
const { getUserBalance, updateWithdrawEnable, insertBalanceLog } = require("../../models/balance");
const { TBG_TOKEN_SYMBOL, UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { Decimal } = require("decimal.js");
const { getAccountInfo } = require("../../models/account");
const { ACCOUNT_INACTIVATED } = require("../../common/constant/accountConstant.js")
const INVEST_CONSTANT = require("../../common/constant/investConstant.js");

// 帮朋友投资
async function friendInvest(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
        const friendAccount = reqData.friendAccountName;
        const accountName = reqData.account_name;
        const investAmount = INVEST_CONSTANT.INVEST_AMOUNT;
        // 获取用户的可用额度
        let rows = await getUserBalance(accountName);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        // 获取用户的状态
        let accountInfo = await getAccountInfo(friendAccount);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        // 检查朋友的账户是否已经激活
        if (accountInfo.state !== ACCOUNT_INACTIVATED) {
            return res.send(get_status(1013, "this account had activated"));
        }
        
        let userBalance = new Decimal(rows.withdraw_enable);
        // 检查余额是否足够
        if (userBalance.lessThan(investAmount)) {
            return res.send(get_status(1011, "insufficient balance"));
        }
        let remark = `user ${ accountName } help user ${ friendAccount } invest ${ investAmount } UE`
        let changeAmount = new Decimal(-investAmount);
        const now = new Date();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // 帮朋友投资，扣除用户的额度
            await updateWithdrawEnable(client, friendAccount, changeAmount.toNumber());
            await insertBalanceLog(client, friendAccount, changeAmount, userBalance, "friend_invest", { "symbol": UE_TOKEN_SYMBOL }, remark, now);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            logger.error(`update user %s balance error, update amount is %O, time is %O`, friendAccount, changeAmount, now);
            throw err;
        } finally {
            await client.release();
        }
        
        // 投资
        // await userInvestment(investAmount, friendAccount, remark);
        res.send(get_status(1));
    } catch (err) {
        logger.error("request friendInvest error, the error stock is %O", err);
        throw err;
    }
}

module.exports = friendInvest;