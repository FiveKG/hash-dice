// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/minePool/mined.js": "已结束资产包矿机" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getTradeInfoHistory } = require("../../models/trade");
const { getAssetsInfoById } = require("../../models/asset");
const df = require("date-fns");
const { Decimal } = require("decimal.js");

// 已结束资产包矿机
async function mined(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        // 找出已经完成交易的订单
        const tradeInfo = await getTradeInfoHistory({ "tradeType": "buy", "accountName": accountName, "state": "finished", orderBy: "ASC" });
        let resData = get_status(1);
        // 从交易完成是开始计算挖矿时间
        const apIds = tradeInfo.map(it => it.extra.ap_id);
        const assetsInfo = await getAssetsInfoById(apIds);
        const assetsMap = new Map();
        for (const val of assetsInfo) {
            assetsMap.set(val.id, val);
        }

        let minedCount = 0;
        let miningCount = 0;
        const miningInfo = [];
        let minedAmount = new Decimal(0)
        const now = new Date();
        for (const val of tradeInfo) {
            const assets = assetsMap.get(val.extra.ap_id);
            // 如果时差大于 0, 说明还在挖矿，否则已经结束
            const diffTime = df.differenceInHours(now, val.finished_time);
            const presetDays = assets.preset_days;
            const minedIncome = assets.mining_multiple * assets.amount;
            const perHourMining = new Decimal(minedIncome).div(presetDays);
            if (diffTime > 0) {
                miningCount++;
                minedAmount.add(perHourMining.mul(diffTime));
            } else {
                const tmpObj = {
                    mining_id: val.id,
                    amount: assets.amount,
                    per_hour_mining: perHourMining.toFixed(4), 
                    mined_income: minedIncome,
                    mining_time: presetDays * 24,
                    total_time: presetDays * 24
                }
                miningInfo.push(tmpObj);
                minedAmount.add(minedIncome);
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
        logger.error("request mined error, the error stock is %O", err);
        throw err;
    }
}

module.exports = mined;