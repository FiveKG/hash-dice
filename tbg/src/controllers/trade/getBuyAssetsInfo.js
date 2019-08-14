// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/getBuyAssetsInfo.js": "获取普通买入交易信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 获取普通买入交易信息
async function getBuyAssetsInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request getBuyAssetsInfo error, the error stock is %O", err);
        throw err
    }
}

module.exports = getBuyAssetsInfo;