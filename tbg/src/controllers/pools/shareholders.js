// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/pools/bingo.js": "bingo pool" });
const { get_status, inspect_req_data, redis } = require("../../common/index.js");
const { SHAREHOLDERS_ALLOCATE_RATE } = require("../../common/constant/incomeConstant.js");
const { getAccountMemberLevel } = require("../../models/account");
const { getShareholdersAmount, getHolderHistory, getHolderAccountList } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const { getTbgBalanceInfo } = require("../../models/tbgBalance");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { getBalanceLogByTerm, getBalanceLogInfo } = require("../../models/balanceLog");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const df = require("date-fns");

// shareholders 奖池详情
async function shareholdersAmount(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        
        let holderAmount = await getShareholdersAmount();
        let holderHistory = await getHolderHistory();
        if (!holderAmount || !holderHistory) {
            return res.send(get_status(1010, "shareholders pool does not exists"));
        }

        if (!holderHistory.issue) {
            holderHistory.issue = 0;
        }
        // 获取当前的期数
        let periods = await redis.get(`tbg:periods:${SHAREHOLDERS_POOL}`);
        let currPeriods = 1
        if(!!periods) {
            currPeriods = parseInt(periods);
        }

        let holderPoolAmount = new Decimal(holderAmount.pool_amount);
        
        // 本次分配的金额
        let distrEnable = holderPoolAmount.mul(INCOME_CONSTANT.SHAREHOLDERS_ALLOCATE_RATE).div(INCOME_CONSTANT.BASE_RATE);
        let holderAccountList = await getHolderAccountList();
        logger.debug("holderPoolAmount: ,distrEnable: ", holderPoolAmount, distrEnable);
        logger.debug("holderAccountList: ", holderAccountList)
        if (holderAccountList.length === 0) {
            return;
        }
        // 计算每个 TBG 可以分配多少个额度
        const total = holderAccountList.map(it => it.sell_amount).reduce((pre, curr) => Number(pre) + Number(curr));
        const bonus = distrEnable.div(total);

        let issue = new Decimal(holderHistory.issue).abs();
        resData["data"] = {
            periods: currPeriods,
            dividend_enable: distrEnable.toFixed(4),
            bonus: bonus.toFixed(8),
            quantity: holderPoolAmount.toFixed(4),
            issue: issue.toFixed(4),
            dividend_rate: INCOME_CONSTANT.SHAREHOLDERS_ALLOCATE_RATE
        };
        res.send(resData);
    } catch (err) {
        logger.error("request shareholdersAmount error, the error stock is %O", err);
        throw err;
    }
}

module.exports = shareholdersAmount;