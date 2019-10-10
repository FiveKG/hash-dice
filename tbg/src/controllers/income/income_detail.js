// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "投资收益详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { redis } = require("../../common");
const { startParse } = require("../../common/parseIncomeData");

// 投资收益详情
async function incomeDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
        let accountName = reqData.account_name;
        let incomeMap = await redis.hgetall(`tbg:income:${ accountName }`);
        let detailArr = await startParse(incomeMap);
        let resDate = get_status(1);
        resDate["data"] = detailArr
        res.send(resDate);
    } catch (err) {
        logger.error("request income incomeDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = incomeDetail;