// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sellAssetsHistory.js": "资产包卖出记录" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 资产包卖出记录
async function sellAssetsHistory(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request sellAssetsHistory TBG error, the error stock is %O", err);
        throw err
    }
}

module.exports = sellAssetsHistory;