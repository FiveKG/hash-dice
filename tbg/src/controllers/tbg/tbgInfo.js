// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/tbgInfo.js": "TBG 概况" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { GAME_AIRDROP } = require("../../common/constant/tbgAllocateRate");

// TBG 概况
async function tbgInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

    } catch (err) {
        logger.error("request tbgInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = tbgInfo;