// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/global_lotto/gameSessionMineDetail.js": "获取当前用户某一期投注的详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");

// 获取当前用户某一期投注的详情
async function gameSessionMineDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        res.send(resData);
    } catch (err) {
        logger.error("request gameSessionMineDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionMineDetail;