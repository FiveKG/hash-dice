// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/income/income_detail.js": "投资收益详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { redis } = require("../../common");
const { startParse } = require("../../common/parseIncomeData");

// 投资收益详情
async function incomeDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: ${ reqData }`);
        let accountName = reqData.account_name;
        let incomeMap = await redis.hgetall(`income:${ accountName }`);
        let detailArr = await startParse(incomeMap);
        let resDate = get_status(1);
        resDate["data"] = detailArr
        res.send(resDate);
    } catch (err) {
        throw err
    }
}

module.exports = incomeDetail;