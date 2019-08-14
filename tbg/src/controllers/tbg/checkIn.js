// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/checkIn.js": "签到" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 签到
async function checkIn(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

    } catch (err) {
        logger.error("request checkIn error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkIn;