// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sellAssets.js": "卖出 TBG" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 卖出 TBG
async function sellAssets(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request sellAssets error, the error stock is %O", err);
        throw err
    }
}

module.exports = sellAssets;