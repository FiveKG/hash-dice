// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/balance/balance_info.js": "look up enable withdraw currency" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserBalance } = require("../../models/balance");
const { WITHDRAW_ENABLE } = require("../../common/constant/balanceConstants");
const { Decimal } = require("decimal.js");

// 自己投资
async function balanceInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: ${ JSON.stringify(reqData) }`);
        let rows = await getUserBalance(reqData.account_name);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let resData = get_status(1);
        let amount = new Decimal(rows.amount);
        let withdrawEnable = new Decimal(rows.withdraw_enable);
        resData["data"] = {
            withdraw_enable: withdrawEnable.toFixed(4),
            total_amount: amount.toFixed(4),
        }
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = balanceInfo;