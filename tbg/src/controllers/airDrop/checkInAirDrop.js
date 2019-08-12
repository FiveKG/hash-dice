// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/airDrop/checkInAirDrop.js": "check-in airdrop" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 每日签到空投
async function checkInAirDrop(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request check-in airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkInAirDrop;