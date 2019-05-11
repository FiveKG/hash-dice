// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/pools/bingo.js": "bingo pool" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountMemberLevel } = require("../../models/account");
const { getBingoAmount, getBingoHistory } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const { getBingoAccountList } = require("../../models/systemPool");
const df = require("date-fns");

// bingo 奖池详情
async function bingo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        // let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        // if (!userMemberLevel) {
        //     return res.send(get_status(1001, "this account does not exists"));
        // }
        let bingoPool = await getBingoAmount();
        let bingoHistory = await getBingoHistory();
        let bingoAccountList = await getBingoAccountList();
        if (!bingoPool || !bingoHistory) {
            return res.send(get_status(1008, "bingo pool does not exists"));
        }

        if (!bingoHistory.issue) {
            bingoHistory.issue = 0;
        }

        let bingoPoolAmount = new Decimal(bingoPool.pool_amount);
        let currentAmount = bingoPoolAmount.mul(70 / 100);
        let now = new Date();
        let dayEnd = df.endOfDay(now);
        resData["data"] = {
            "total": bingoPoolAmount.toFixed(4),
            "this_period_rate": `70%`,
            "last_invest_rate": `50%`,
            "this_period_bonus": bingoPoolAmount.toFixed(4),
            "last_invest_account": bingoAccountList[0].account_name,
            "last_invest_bonus": currentAmount.mul(50 / 100).toFixed(4),
            "other_invest_bonus": currentAmount.mul(50 / 100 / 29).toFixed(4),
            "bonus_account": bingoAccountList.map(item => item.account_name),
            "bingo_countdown": df.format(dayEnd, "x"),
        };
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = bingo;