// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "有效资产包矿机" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getTradeInfoHistory } = require("../../models/trade");
const { getAssetsInfoById } = require("../../models/asset");
const df = require("date-fns");
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");

// 有效资产包矿机
async function mining(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        // 找出已经完成交易的订单
        const tradeInfo = await getTradeInfoHistory({ "tradeType": OPT_CONSTANTS.BUY, "accountName": accountName, "state": "finished", orderBy: "ASC" });
        let resData = get_status(1);
        // 从交易完成是开始计算挖矿时间
        const apIds = tradeInfo.map(it => it.extra.ap_id);
        const assetsInfo = await getAssetsInfoById(apIds);
        logger.debug("assetsInfo: ", assetsInfo);
        const assetsMap = new Map();
        for (const val of assetsInfo) {
            assetsMap.set(val.id, val);
        }

        let minedCount = 0;
        let miningCount = 0;
        const miningInfo = [];
        let minedAmount = new Decimal(0);
        const now = new Date();
        for (const val of tradeInfo) {
            const assets = assetsMap.get(val.extra.ap_id);
            const diffTime = df.differenceInHours(now, val.finished_time);
            const presetDays = assets.preset_days;
            const minedIncome = assets.mining_multiple * assets.amount;
            const perHourMining = new Decimal(minedIncome).div(presetDays).div(24);
            // 如果时差小于总挖矿时间，说明还在挖矿，否则已经结束
            if (diffTime < presetDays * 24) {
                miningCount++;
                const tmpObj = {
                    mining_id: val.id,
                    amount: new Decimal(assets.amount).toNumber(),
                    per_hour_mining: perHourMining.toFixed(4), 
                    mining_income: perHourMining.mul(diffTime).toFixed(4),
                    mining_time: diffTime,
                    total_time: presetDays * 24
                }
                minedAmount = minedAmount.add(tmpObj.mining_income);
                miningInfo.push(tmpObj);
            } else {
                minedAmount = minedAmount.add(assets.mining_multiple * assets.amount);
                minedCount++;
            }
        }
        
        resData["data"] = {
            "mining_count": miningCount,
            "mined_amount": minedAmount.toFixed(8),
            "mined_count": minedCount,
            "mining_info": miningInfo
        }
        res.send(resData);
    } catch (err) {
        logger.error("request mining error, the error stock is %O", err);
        throw err
    }
}

module.exports = mining;