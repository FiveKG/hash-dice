// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/releasePool.js": "线性释放池资料" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 线性释放池资料
async function releasePool(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

    } catch (err) {
        logger.error("request releasePool error, the error stock is %O", err);
        throw err;
    }
}

module.exports = releasePool;