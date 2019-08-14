// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/minePool/detail.js": "资产包挖矿详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 资产包挖矿详情
async function detail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
    } catch (err) {
        logger.error("request detail error, the error stock is %O", err);
        throw err
    }
}

module.exports = detail;