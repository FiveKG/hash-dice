// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/releasePoolDetail.js": "线性释放池明细" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 线性释放池明细
async function releasePoolDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

    } catch (err) {
        logger.error("request releasePoolDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = releasePoolDetail;