// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/balance/withdrawHistory.js": "user withdraw" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getBalanceHistory } = require("../../models/balance");
const { Decimal } = require("decimal.js");

// 自己投资
async function withdrawHistory(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of withdraw withdrawHistory is: ${ JSON.stringify(reqData) }`);
        let rows = await getBalanceHistory(reqData.account_name);
        logger.debug(`withdraw history: ${ JSON.stringify(rows) }`);
        let resData = get_status(1);
        let data = rows.map(item => {
            return {
                create_time: item.create_time,
                withdraw_amount: new Decimal(item.change_amount).abs()
            }
        })
        resData["data"] = data;
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = withdrawHistory;