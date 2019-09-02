// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/investment_index.js": "投资首页" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserSubAccount } = require("../../models/subAccount");
const { getSafeAmount, getShareholdersAmount, getOneAccount } = require("../../models/systemPool");
const { PK_POOL, BINGO_POOL } = require("../../common/constant/accountConstant.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js");
const { getUserBalance } = require("../../models/balance");
const { Decimal } = require("decimal.js");
const df = require("date-fns");

// 投资首页
async function investmentIndex(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of investmentIndex is: %j`, reqData);
        let subAccountList = await getUserSubAccount(reqData.account_name);
        let rows = await getUserBalance(reqData.account_name);
        let safePool = await getSafeAmount();
        let holderAmount = await getShareholdersAmount();
        let pkPool = await getOneAccount(PK_POOL);
        let bingoPool = await getOneAccount(BINGO_POOL);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }        
        if (!holderAmount) {
            return res.send(get_status(1010, "shareholders pool does not exists"));
        }
        if (!safePool) {
            return res.send(get_status(1009, "safe pool does not exists"));
        }
        if (!pkPool) {
            logger.debug(`system account ${ PK_POOL } not found`);
            return res.send(get_status(1014, "pk pool does not exists"));;
        }
        if (!bingoPool) {
            logger.debug(`system account ${ BINGO_POOL } not found`);
            return res.send(get_status(1008, "bingo pool does not exists"));;
        }
        let userBalance = new Decimal(rows.amount);
        let withdraw_enable = new Decimal(rows.withdraw_enable);
        let repeatCurrency = new Decimal(rows.repeat_currency);
        let bingoCurrency = new Decimal(rows.lotto_currency);
        let gameCurrency = new Decimal(rows.game_currency);
        let holderPoolAmount = new Decimal(holderAmount.pool_amount);
        let safePoolAmount = new Decimal(safePool.pool_amount);
        let pkPoolAmount = new Decimal(pkPool.pool_amount);
        let bingoPoolAmount = new Decimal(bingoPool.pool_amount);
        let resDate = get_status(1);
        let now = new Date();
        let dayEnd = df.endOfDay(now);
        const bingoLastInvest = bingoPoolAmount.mul(INCOME_CONSTANT.BINGO_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE).mul(INCOME_CONSTANT.BINGO_INCOME_OTHER / INCOME_CONSTANT.BASE_RATE).toFixed(4);
        const bingoOtherInvest = bingoPoolAmount.mul(INCOME_CONSTANT.BINGO_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE).mul(INCOME_CONSTANT.BINGO_INCOME_OTHER / INCOME_CONSTANT.BASE_RATE / 29).toFixed(4)
        resDate["data"] = {
            "account_name": reqData.account_name,
            "sub_account_count": subAccountList.length,
            "total_income": userBalance.toFixed(8),
            "last_invest": bingoLastInvest,
            "other_invest": bingoOtherInvest,
            "bingo_countdown": df.format(dayEnd, "x"),
            "withdraw_enable": withdraw_enable.toFixed(4),
            "repeat_currency": repeatCurrency.toFixed(4),
            "bingo_currency": bingoCurrency.toFixed(4),
            "game_currency": gameCurrency.toFixed(4),
            "shareholders_bonus": holderPoolAmount.toFixed(4),
            "safe_bonus": safePoolAmount.toFixed(4),
            "pk_bonus": pkPoolAmount.toFixed(4)
        }
        res.send(resDate);
    } catch (err) {
        logger.error("request investmentIndex error, the error stock is %O", err);
        throw err;
    }
}

module.exports = investmentIndex;