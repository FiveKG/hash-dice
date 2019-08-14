// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/buyList.js": "买入交易列表" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 买入交易列表
async function buyList(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request buyList error, the error stock is %O", err);
        throw err
    }
}

module.exports = buyList;