// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/raiseBuy.js": "全球合伙人私募" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 全球合伙人私募
async function raiseBuy(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request raise buy TBG error, the error stock is %O", err);
        throw err
    }
}

module.exports = raiseBuy;