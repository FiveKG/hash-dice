// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/sub_account.js": "用户子帐号" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserSubAccount } = require("../../models/subAccount");
const { getUserBalance } = require("../../models/balance");
const { REPEAT_CURRENCY, BASE_RATE } = require("../../common/constant/balanceConstants");
const { Decimal } = require("decimal.js");

// 用户子帐号
async function subAccount(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of setting referrer is: %j`, reqData);
        let subAccountList = await getUserSubAccount(reqData.account_name);
        let data = []
        for (let i = 0; i < subAccountList.length; i++) {
            let num = subAccountList[i].sub_account_name.split("-")[1];
            let detail = ``;
            if (i === 0) {
                detail = "初始投资";
            } else {
                detail = "复投产生";
            }
            data.push({
                sub_account_num: num,
                detail: detail
            })
        }
       
        let rows = await getUserBalance(reqData.account_name);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let userBalance = new Decimal(rows.amount);

        // 复投帐号数量
        let quantity = 0;
        let len = subAccountList.length;
        if (len) {
            quantity = len - 1;
        }
        let resDate = get_status(1);
        resDate["data"] = {
            total_sub_account: len,
            repeat_currency: userBalance.mul(REPEAT_CURRENCY / BASE_RATE).toFixed(4),
            repeat_quantity: quantity,
            detail: data
        }
        res.send(resDate);
    } catch (err) {
        logger.error("request subAccount error, the error stock is %O", err);
        throw err;
    }
}

module.exports = subAccount;