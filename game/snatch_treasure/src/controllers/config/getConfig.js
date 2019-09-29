// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/config/getConfig.js": "get config" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { BANKER, CHAIN_ID, END_POINT } = require("../../common/constant/eosConstants.js");

// 获取配置信息
async function getConfig(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
        let resData = get_status(1);
        resData["data"] = {
            wallet_receiver: BANKER,
            trade_receiver: BANKER,
            "httpEndPoint": END_POINT,
            "chainId": CHAIN_ID
        }
        res.send(resData);
    } catch (err) {
        logger.error("request getConfig error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getConfig;