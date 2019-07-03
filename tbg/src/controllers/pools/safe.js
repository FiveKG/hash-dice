// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/pools/safe.js": "safe pool" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserBalance } = require("../../models/balance");
const { getSafeAmount, getSafeHistory } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");

// safe 奖池详情
async function safe(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        let accountName = reqData.account_name
        let rows = await getUserBalance(accountName);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let safePool = await getSafeAmount();
        let safeHistory = await getSafeHistory();
        if (!safePool || !safeHistory) {
            return res.send(get_status(1009, "safe pool does not exists"));
        }

        if (!safeHistory.issue) {
            safeHistory.issue = 0;
        }

        let amount = new Decimal(safePool.pool_amount);
        let issue = new Decimal(safeHistory.issue).abs();
        resData["data"] = {
            current_amount: amount.toFixed(4),
            issue: issue,
            total: amount.add(issue).toFixed(4),
            account_income: rows.amount,
        };
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = safe;