// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sellList.js": "卖出交易列表" });
const { get_status } = require("../../common/index.js");
const { getTradeInfoHistory } = require("../../models/trade");

// 卖出交易列表
async function sellList(req, res, next) {
    try {
        const tradeInfo = await getTradeInfoHistory({ "tradeType": "sell", state: "create", orderBy: "ASC" });
        let resData = get_status(1);
        resData["data"] = tradeInfo.map(it => {
            return {
                "create_time": it.create_time,
                "price": it.price,
                "amount": it.amount,
                "transaction": it.trx_amount
            }
        });
        res.send(resData);
    } catch (err) {
        logger.error("request sellList error, the error stock is %O", err);
        throw err
    }
}

module.exports = sellList;