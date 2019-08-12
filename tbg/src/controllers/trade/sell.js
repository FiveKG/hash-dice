// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sell.js": "sell TBG" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 卖出 TBG
async function sell(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request sell TBG error, the error stock is %O", err);
        throw err;
    }
}

module.exports = sell;