// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/minePool/detail.js": "资产包挖矿详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getTradeInfoById } = require("../../models/trade");
const { getAssetsInfoById } = require("../../models/asset");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const df = require("date-fns");
const { Decimal } = require("decimal.js");

// 资产包挖矿详情
async function detail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const { account_name: accountName, mining_id: miningId } = reqData;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        // 找出已经完成交易的订单
        const tradeInfo = await getTradeInfoById(miningId);
        if (!tradeInfo) {
            return res.send(get_status(1018, "this account does not exists"));
        }

        // 从交易完成是开始计算挖矿时间
        const now = new Date();
        const diffTime = df.differenceInHours(now, tradeInfo.finished_time);
        const assetsInfo = await getAssetsInfoById([ tradeInfo.extra.ap_id ]);
        const presetDays = assetsInfo[0].preset_days;
        const minedIncome = assetsInfo[0].mining_multiple * assetsInfo[0].amount;
        const perHourMining = new Decimal(minedIncome).div(presetDays);
        const balanceLogInfo = await getBalanceLogInfo(accountName, tradeInfo.id);
        let state = false;
        // 如果还没收取过挖矿收益
        if (!balanceLogInfo) {
            state = diffTime >= 24 ? true : false;
        } else {
            // 收取过挖矿收益，找到最新的一条, 判断是否超过 24h
            state = df.differenceInHours(now, balanceLogInfo.create_time) >= 24 ? true : false;
        }
        let resData = get_status(1);
        resData["data"] = {
            "amount": assetsInfo[0].amount,
            "per_hour_mining": perHourMining.toFixed(4),
            "mined": perHourMining.mul(diffTime).toFixed(8),
            "mining_time": diffTime,
            "total_time": presetDays * 24,
            "collect_amount": perHourMining,
            "state": state
        }
        res.send(resData);
    } catch (err) {
        logger.error("request detail error, the error stock is %O", err);
        throw err
    }
}

module.exports = detail;