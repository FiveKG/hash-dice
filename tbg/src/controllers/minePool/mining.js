// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/minePool/mining.js": "有效资产包矿机" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 有效资产包矿机
async function mining(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request mining error, the error stock is %O", err);
        throw err
    }
}

module.exports = mining;