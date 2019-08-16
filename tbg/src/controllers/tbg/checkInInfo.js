// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/checkInInfo.js": "获取签到奖励明细" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { CHECK_IN_AIRDROP_ID, AIRDROP } = require("../../common/constant/tbgAllocateRate");
const { TBG_TOKEN_SYMBOL, TBG_TOKEN } = require("../../common/constant/eosConstants");
const { getAccountInfo } = require("../../models/account");
const { getCurrencyStats } = require("../../job/getTrxAction.js");
const { getSystemLogInfo } = require("../../models/systemOpLog");
const { getBalanceLogInfo } = require("../../models/balanceLog");
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

        const { [TBG_TOKEN_SYMBOL]: { max_supply } } = await getCurrencyStats(TBG_TOKEN, TBG_TOKEN_SYMBOL);
        // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
        const maxSupply = new Decimal(max_supply.split(" ")[0]);
        // 查询空投记录
        const systemOpLogInfo = await getSystemLogInfo(TBG_TOKEN);
        const checkInLog = systemOpLogInfo.find(q => q.op_type === CHECK_IN_AIRDROP_ID);
        const checkInAirdropInfo = AIRDROP.find(it => it.id === CHECK_IN_AIRDROP_ID);
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: CHECK_IN_AIRDROP_ID });
        const detail = balanceLogInfo.map(it => {
            return {
                "create_time": it.create_time,
                "reward": it.change_amount
            }
        })
        let resData = get_status(1);
        const amount = maxSupply.mul(checkInAirdropInfo.rate);
        const quantity = !!checkInLog ? new Decimal(checkInLog.total) : 0;
        resData["data"] = {
            "airdrop_amount": amount.toFixed(8),
            "airdrop_quantity": quantity.toFixed(8),
            "income": 0,
            detail: detail
        }

        res.send(resData);
    } catch (err) {
        logger.error("request checkInInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkInInfo;