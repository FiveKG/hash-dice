// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/config/getConfig.js": "get config" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { WALLET_RECEIVER } = require("../../common/constant/eosConstants.js");

// 获取配置信息
async function getConfig(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of is: ${ JSON.stringify(reqData) }`);
        let resData = get_status(1);
        resData["data"] = {
            wallet_receiver: WALLET_RECEIVER
        }
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = getConfig;