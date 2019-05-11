// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/income/dividend.js": "dividend income" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getDividendIncome } = require("../../models/balance");

// 分红收益详情
async function dividend(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        let page = reqData.page;
        let limit = reqData.limit;
        
        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 10;
        }

        let rows = await getDividendIncome(reqData.account_name, limit, page);
        let detail = rows.map(item => {
            return {
                "create_time": item.create_time,
                "dividend": item.change_amount
            }
        });
        resData["data"] = detail;
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = dividend;