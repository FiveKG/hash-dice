// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/saleableAmount.js": "可售额度" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 可售额度
async function saleableAmount(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

    } catch (err) {
        logger.error("request saleableAmount error, the error stock is %O", err);
        throw err;
    }
}

module.exports = saleableAmount;