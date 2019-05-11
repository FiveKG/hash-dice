// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/pools/bingo.js": "bingo pool" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountMemberLevel } = require("../../models/account");
const { getBingoAmount, getBingoHistory } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");

// bingo 奖池详情
async function bingo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let bingoPool = await getBingoAmount();
        let bingoHistory = await getBingoHistory();
        if (!bingoPool || !bingoHistory) {
            return res.send(get_status(1008, "bingo pool does not exists"));
        }

        if (!bingoHistory.issue) {
            bingoHistory.issue = 0;
        }

        let amount = new Decimal(bingoPool.pool_amount);
        let issue = new Decimal(bingoHistory.issue).abs();
        resData["data"] = {
            current_amount: amount.toFixed(4),
            issue: issue,
            total: amount.add(issue).toFixed(4),
            account_level: userMemberLevel.member_level,
        };
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = bingo;