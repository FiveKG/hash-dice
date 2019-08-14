// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/checkInInfo.js": "获取签到奖励明细" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 获取签到奖励明细
async function checkInInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

    } catch (err) {
        logger.error("request checkInInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkInInfo;