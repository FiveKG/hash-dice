// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/getPrice.js": "获取交易价格" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const asset = require("../../models/asset");
const { redis } = require("../../common");
const { OPENING_PRICE_KEY, BUY_START_TIME, BUY_END_TIME, FIRST_BUY, OPENING_PRICE } = require("../../common/constant/tradeConstant.js");
const { Decimal } = require("decimal.js");

// 获取交易价格
async function getPrice(req, res, next) {
    try {
        let resData = get_status(1);
        // 获取开盘价格
        const openingPrice = await redis.get(OPENING_PRICE_KEY) || OPENING_PRICE;
        resData.data = {
            "price": new Decimal(openingPrice).toNumber()
        }
        return res.send(resData);
    } catch (err) {
        logger.error("request getPrice error, the error stock is %O", err);
        throw err
    }
}

module.exports = getPrice;