// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/checkInInfo.js": "获取签到奖励明细" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { CHECK_IN_AIRDROP_ID, AIRDROP } = require("../../common/constant/tbgAllocateRate");
const { TBG_TOKEN_SYMBOL, TBG_TOKEN } = require("../../common/constant/eosConstants");
const { TBG_TOKEN_COIN } = require("../../common/constant/accountConstant");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { getAccountInfo } = require("../../models/account");
const { getCurrencyStats } = require("../../job/getTrxAction.js");
const { getBalanceLogInfo, getBalanceLogByTerm } = require("../../models/balanceLog");
const { Decimal } = require("decimal.js");

// 获取签到奖励明细
async function checkInInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        const { [TBG_TOKEN_SYMBOL]: { max_supply } } = await getCurrencyStats(TBG_TOKEN_COIN, TBG_TOKEN_SYMBOL);
        // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
        const maxSupply = new Decimal(max_supply.split(" ")[0]);
        // 查询空投记录
        const total = await getBalanceLogByTerm({ symbol: TBG_TOKEN_SYMBOL, opType: OPT_CONSTANTS.CHECK_IN });
        const checkInAirdropInfo = AIRDROP.find(it => it.id === CHECK_IN_AIRDROP_ID);
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: OPT_CONSTANTS.CHECK_IN });
        let sumIncome = new Decimal(0);
        const detail = balanceLogInfo.map(it => {
            sumIncome = sumIncome.add(it.change_amount);
            return {
                "create_time": it.create_time,
                "reward": it.change_amount
            }
        })
        let resData = get_status(1);
        const amount = maxSupply.mul(checkInAirdropInfo.rate);
        const quantity = !!total ? new Decimal(total).toFixed(8) : new Decimal(0).toFixed(8);
        resData["data"] = {
            "airdrop_amount": amount.toFixed(8),
            "airdrop_quantity": quantity,
            "income": sumIncome.toFixed(8),
            "detail": detail
        }

        res.send(resData);
    } catch (err) {
        logger.error("request checkInInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkInInfo;