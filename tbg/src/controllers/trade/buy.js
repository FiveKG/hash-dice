// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/buy.js": "buy TBG" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 买入 TBG
async function buy(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request buy TBG error, the error stock is %O", err);
        throw err
    }
}

module.exports = buy;