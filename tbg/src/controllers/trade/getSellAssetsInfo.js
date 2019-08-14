// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/getSellAssetsInfo.js": "获取普通卖出交易信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 获取普通卖出交易信息
async function getSellAssetsInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request getSellAssetsInfo TBG error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getSellAssetsInfo;