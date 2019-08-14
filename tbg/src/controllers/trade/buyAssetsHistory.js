// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/buyAssetsHistory.js": "资产包买入记录" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 资产包买入记录
async function buyAssetsHistory(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request buyAssetsHistory error, the error stock is %O", err);
        throw err
    }
}

module.exports = buyAssetsHistory;