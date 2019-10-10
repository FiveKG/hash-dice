// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "get config" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { WALLET_RECEIVER, END_POINT, CHAIN_ID, BASE_AMOUNT } = require("../../common/constant/eosConstants.js");
const { TBG_FREE_POOL } = require("../../common/constant/accountConstant");

// 获取配置信息
async function getConfig(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
        let resData = get_status(1);
        resData["data"] = {
            wallet_receiver: WALLET_RECEIVER,
            trade_receiver: TBG_FREE_POOL,
            "httpEndPoint": END_POINT,
            "chainId": CHAIN_ID,
            "base_amount": BASE_AMOUNT
        }
        res.send(resData);
    } catch (err) {
        logger.error("request getConfig error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getConfig;