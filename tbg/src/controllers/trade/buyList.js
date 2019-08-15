// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/buyList.js": "买入交易列表" });
const { get_status } = require("../../common/index.js");
const { getTradeInfoHistory } = require("../../models/trade");

// 买入交易列表
async function buyList(req, res, next) {
    try {      
        const tradeInfo = await getTradeInfoHistory({ "tradeType": "buy", state: "create", orderBy: "ASC" });
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
        logger.error("request buyList error, the error stock is %O", err);
        throw err
    }
}

module.exports = buyList;