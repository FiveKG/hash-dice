// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "我的分红" });
const { get_status, inspect_req_data, redis } = require("../../common/index.js");
const { getShareholdersAmount, getHolderHistory, getHolderAccountList } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const { getTbgBalanceInfo } = require("../../models/tbgBalance");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { getBalanceLogByTerm, getBalanceLogInfo } = require("../../models/balanceLog");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const df = require("date-fns");

// 我的分红
async function myDividend(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        
        let holderAmount = await getShareholdersAmount();
        if (!holderAmount) {
            return res.send(get_status(1010, "shareholders pool does not exists"));
        }
        // 获取当前的期数
        let periods = await redis.get(`tbg:periods:${SHAREHOLDERS_POOL}`);
        logger.debug("periods: ", periods);
        let currPeriods = 1
        if(!!periods) {
            currPeriods = parseInt(periods);
        }
        // 获取用户的 tbg 可售数量
        let tbgBalance = await getTbgBalanceInfo(reqData.account_name);
        logger.debug("tbgBalance: ", tbgBalance);
        let sellAmount = new Decimal(0);
        if (!!tbgBalance) {
            sellAmount = sellAmount.add(tbgBalance.sell_amount);
        }
        const balanceLogInfo = await getBalanceLogInfo({ accountName: reqData.account_name, opType: OPT_CONSTANTS.HOLDER, symbol: UE_TOKEN_SYMBOL })
        logger.debug("balanceLogInfo: ", balanceLogInfo);
        let holderPoolAmount = new Decimal(holderAmount.pool_amount);
        // 本次分配的金额
        let distrEnable = holderPoolAmount.mul(INCOME_CONSTANT.SHAREHOLDERS_ALLOCATE_RATE).div(INCOME_CONSTANT.BASE_RATE);
        let holderAccountList = await getHolderAccountList();
        if (holderAccountList.length === 0) {
            return res.send(get_status(1026, "你还未获取到分红"));
        }
        // 计算每个 TBG 可以分配多少个额度
        const total = holderAccountList.map(it => it.sell_amount).reduce((pre, curr) => Number(pre) + Number(curr));
        const bonus = distrEnable.div(total);
        let dividendAmount = new Decimal(0);
        const detail = balanceLogInfo.map(it => {
            dividendAmount = dividendAmount.add(it.change_amount);
            return {
                "create_time": it.create_time,
                "issue": it.extra.periods,
                "income": new Decimal(it.change_amount).toFixed(8)
            }
        })

        resData["data"] = {
            periods: currPeriods,
            sell_amount: sellAmount.toFixed(8),
            bonus: bonus.toFixed(8),
            dividend: dividendAmount.toFixed(8),
            dividend_enable: sellAmount.mul(bonus).toFixed(8),
            detail: detail,
        };
        res.send(resData);
    } catch (err) {
        logger.error("request myDividend error, the error stock is %O", err);
        throw err;
    }
}

module.exports = myDividend;