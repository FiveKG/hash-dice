// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/saleableBalance.js": "可售余额" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { getTbgBalanceInfo } = require("../../models/tbgBalance");
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");

// 可售余额
async function saleableBalance(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName });
        const tbgBalance = await getTbgBalanceInfo(accountName);

        let resData = get_status(1);
        resData["data"] = {
            "saleable_amount": new Decimal(tbgBalance.active_amount).toFixed(8),
            "detail": balanceLogInfo.filter(it  => {
                if (it.op_type === OPT_CONSTANTS.RELEASE || it.op_type === OPT_CONSTANTS.SELL) {
                    return {
                        "create_time": it.create_time,
                        "info": it.op_type,
                        "amount": it.change_amount,
                        "balance": it.current_balance
                    }
                }
            })
        }
        res.send(resData);
    } catch (err) {
        logger.error("request saleableBalance error, the error stock is %O", err);
        throw err;
    }
}

module.exports = saleableBalance;