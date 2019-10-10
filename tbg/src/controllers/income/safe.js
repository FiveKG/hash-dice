// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "三倍收益保障" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getSafeIncome } = require("../../models/balance");

// 三倍收益保障
async function safe(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        let page = reqData.page;
        let limit = reqData.limit;
        let accountName = reqData.account_name;
        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 10;
        }
        
        let rows = await getSafeIncome(accountName, limit, page);
        let detail = rows.map(item => {
            return {
                "create_time": item.create_time,
                "dividend": item.change_amount
            }
        });
        resData["data"] = detail;
        res.send(resData);
    } catch (err) {
        logger.error("request income safe error, the error stock is %O", err);
        throw err;
    }
}

module.exports = safe;