// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/global_lotto/bet.js": "投注" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");

// 投注
async function bet(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        res.send(resData);
    } catch (err) {
        logger.error("request bet error, the error stock is %O", err);
        throw err;
    }
}

module.exports = bet;