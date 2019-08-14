// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sellList.js": "卖出交易列表" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 卖出交易列表
async function sellList(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request sellList error, the error stock is %O", err);
        throw err
    }
}

module.exports = sellList;