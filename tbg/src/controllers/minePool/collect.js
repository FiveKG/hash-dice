// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/minePool/collect.js": "资产包挖矿收益收取" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 资产包挖矿收益收取
async function collect(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request collect error, the error stock is %O", err);
        throw err
    }
}

module.exports = collect;