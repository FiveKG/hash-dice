// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "bingo pool" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js");
const { getBingoAmount, getBingoHistory } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const { getBingoAccountList } = require("../../models/systemPool");
const df = require("date-fns");

// bingo 奖池详情
async function bingo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
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
        let currentAmount = bingoPoolAmount.mul(INCOME_CONSTANT.BINGO_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE);
        let now = new Date();
        let dayEnd = df.endOfDay(now);
        resData["data"] = {
            "total": bingoPoolAmount.toFixed(4),
            "this_period_rate": `70%`,
            "last_invest_rate": `50%`,
            "this_period_bonus": bingoPoolAmount.toFixed(4),
            "last_invest_account": !!bingoAccountList[0] ? bingoAccountList[0].account_name : '',
            "last_invest_bonus": currentAmount.mul(INCOME_CONSTANT.BINGO_INCOME_FIRST / INCOME_CONSTANT.BASE_RATE).toFixed(4),
            "other_invest_bonus": currentAmount.mul(INCOME_CONSTANT.BINGO_INCOME_OTHER / INCOME_CONSTANT.BASE_RATE / 29).toFixed(4),
            "bonus_account": bingoAccountList.map(item => item.account_name),
            "bingo_countdown": df.format(dayEnd, "x"),
        };
        res.send(resData);
    } catch (err) {
        logger.error("request bingo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = bingo;