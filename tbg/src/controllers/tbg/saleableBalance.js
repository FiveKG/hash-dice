// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/saleableBalance.js": "可售余额" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 可售余额
async function saleableBalance(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

    } catch (err) {
        logger.error("request saleableBalance error, the error stock is %O", err);
        throw err;
    }
}

module.exports = saleableBalance;