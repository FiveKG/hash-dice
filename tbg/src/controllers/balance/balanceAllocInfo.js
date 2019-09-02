// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/balance/balanceAllocInfo.js": "收益分配" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserBalance } = require("../../models/balance");
const { WITHDRAW_ENABLE, REPEAT_CURRENCY, BASE_RATE, LOTTO_CURRENCY, GAME_CURRENCY } = require("../../common/constant/balanceConstants");
const { Decimal } = require("decimal.js");

// 自己投资
async function balanceAllocInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %J: `, reqData);
        let rows = await getUserBalance(reqData.account_name);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let resData = get_status(1);
        let amount = new Decimal(rows.amount);
        let withdrawEnable = new Decimal(rows.withdraw_enable);
        resData["data"] = {
            "withdraw_enable": withdrawEnable.toFixed(4),
            "withdraw_enable_rage": WITHDRAW_ENABLE,
            "repeat_currency": new Decimal(rows.repeat_currency).toFixed(4),
            "repeat_currency_rage": REPEAT_CURRENCY,
            "lotto_currency": new Decimal(rows.lotto_currency).toFixed(4),
            "lotto_currency_rage": LOTTO_CURRENCY,
            "game_currency": new Decimal(rows.game_currency).toFixed(4),
            "game_currency_rage": GAME_CURRENCY
        }
        res.send(resData);
    } catch (err) {
        logger.error("request balanceAllocInfo error, the error stock is %O", err);
        throw err
    }
}

module.exports = balanceAllocInfo;