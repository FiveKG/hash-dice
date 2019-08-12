// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/balance/withdraw.js": "user withdraw" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserBalance } = require("../../models/balance");
const userWithdraw = require("../../db/psUserWithdraw.js");
const { Decimal } = require("decimal.js");

// 用户提现
async function withdraw(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of withdraw is %j: `, reqData);
        let accountName = reqData.account_name;
        let amount = new Decimal(reqData.amount);
        if (amount.lessThanOrEqualTo(0)) {
            return res.send(get_status(1005, "invalid balance"));
        }
       
        let rows = await getUserBalance(accountName);
        logger.debug(`user balance is %O: `, rows);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        if (!amount.lessThan(rows.withdraw_enable)) {
            return res.send(get_status(1011, "insufficient balance"));
        }

        const withdrawData = {
            "account_name": accountName,
            "amount": amount.tonumber(),
            "symbol": reqData.symbol
        };
        logger.debug(`发布提现消息, withdrawData: %j`, withdrawData);
    
        await userWithdraw.pub(withdrawData);
    
        logger.debug(`发布提现消息, 成功...`);
        res.send(get_status(1, "提现进行中, 请稍后刷新查看"));
    } catch (err) {
        logger.error("request withdraw error, the error stock is %O", err);
        throw err
    }
}

module.exports = withdraw;