// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/buyAssets.js": "买入资产包" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 买入资产包
async function buyAssets(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request buyAssets error, the error stock is %O", err);
        throw err
    }
}

module.exports = buyAssets;