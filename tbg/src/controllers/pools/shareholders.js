// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/pools/bingo.js": "bingo pool" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { SHAREHOLDERS_ALLOCATE_RATE } = require("../../common/constant/incomeConstant.js");
const { getAccountMemberLevel } = require("../../models/account");
const { getShareholdersAmount, getHolderHistory } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");

// shareholders 奖池详情
async function shareholdersAmount(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let holderAmount = await getShareholdersAmount();
        let holderHistory = await getHolderHistory();
        if (!holderAmount || !holderHistory) {
            return res.send(get_status(1010, "shareholders pool does not exists"));
        }

        if (!holderHistory.issue) {
            holderHistory.issue = 0;
        }

        let amount = new Decimal(holderAmount.pool_amount);
        let issue = new Decimal(holderHistory.issue).abs();
        resData["data"] = {
            enable_quantity: amount.toFixed(4),
            rate: SHAREHOLDERS_ALLOCATE_RATE,
            total: amount.add(issue).toFixed(4),
            detail: holderHistory,
        };
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = shareholdersAmount;