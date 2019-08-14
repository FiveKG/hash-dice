// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/getRaiseInfo.js": "// 获取全球合伙人私募信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 获取全球合伙人私募信息
async function getRaiseInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request getRaiseInfo error, the error stock is %O", err);
        throw err
    }
}

module.exports = getRaiseInfo;