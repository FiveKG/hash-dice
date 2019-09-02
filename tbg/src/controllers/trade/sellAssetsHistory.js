// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sellAssetsHistory.js": "资产包卖出记录" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getTradeInfoHistory } = require("../../models/trade");
const { Decimal } = require("decimal.js");

// 资产包卖出记录
async function sellAssetsHistory(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        const tradeInfo = await getTradeInfoHistory({ "tradeType": "sell", "accountName": accountName, orderBy: "DESC" });
        let resData = get_status(1);
        resData["data"] = tradeInfo.map(it => {
            return {
                "create_time": it.create_time,
                "price": new Decimal(it.price).toFixed(4),
                "amount": new Decimal(it.amount).toNumber(),
                "options": it.state
            }
        })
        res.send(resData);
    } catch (err) {
        logger.error("request sellAssetsHistory TBG error, the error stock is %O", err);
        throw err
    }
}

module.exports = sellAssetsHistory;