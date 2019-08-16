// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/saleableAmount.js": "可售额度" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getBalanceLogInfo } = require("../../models/balanceLog");

// 可售额度
async function saleableAmount(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName });

        let resData = get_status(1);
        resData["data"] = {
            "detail": balanceLogInfo.filter(it  => {
                if (it.op_type === "") {
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
        logger.error("request saleableAmount error, the error stock is %O", err);
        throw err;
    }
}

module.exports = saleableAmount;