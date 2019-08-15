// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sellList.js": "卖出交易列表" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getTradeInfoHistory } = require("../../models/trade");

// 卖出交易列表
async function sellList(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        const tradeType = "sell";
        const tradeInfo = await getTradeInfoHistory(accountName, tradeType, "create");
        let resData = get_status(1);
        resData["data"] = tradeInfo.map(it => {
            return {
                "create_time": it.create_time,
                "price": it.price,
                "amount": it.amount,
                "transaction": it.trx_amount
            }
        })
        res.send(resData);
    } catch (err) {
        logger.error("request sellList error, the error stock is %O", err);
        throw err
    }
}

module.exports = sellList;