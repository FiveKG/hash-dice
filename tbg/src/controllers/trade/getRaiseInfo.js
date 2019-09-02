// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/getRaiseInfo.js": "// 获取全球合伙人私募信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const asset = require("../../models/asset");
const { redis } = require("../../common");
const { OPENING_PRICE_KEY, RAISE_PRICE, BASE_RATE, OPENING_PRICE } = require("../../common/constant/tradeConstant.js");
const { Decimal } = require("decimal.js");

// 获取全球合伙人私募信息
async function getRaiseInfo(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        // 获取全球合伙人私募资产包信息
        const assetsInfo = await asset.getAssetsInfo("raise");
        const assets_info = assetsInfo.map(it => {
            return {
                id: it.id,
                amount: new Decimal(it.amount).toNumber(),
                release_pool: new Decimal(it.release_multiple).mul(it.amount),
                mining_pool: new Decimal(it.mining_multiple).mul(it.amount)
            }
        });
        // 获取开盘价格
        const openingPrice = await redis.get(OPENING_PRICE_KEY) || OPENING_PRICE;
        resData.data = {
            "price": new Decimal(openingPrice).toNumber(),
            "raise_price": new Decimal(openingPrice).mul(RAISE_PRICE / BASE_RATE).toFixed(4),
            "assets_info": assets_info
        }
        return res.send(resData);
    } catch (err) {
        logger.error("request getRaiseInfo error, the error stock is %O", err);
        throw err
    }
}

module.exports = getRaiseInfo;