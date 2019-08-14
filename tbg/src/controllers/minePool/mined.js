// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/minePool/mined.js": "已结束资产包矿机" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 已结束资产包矿机
async function mined(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request mined error, the error stock is %O", err);
        throw err;
    }
}

module.exports = mined;