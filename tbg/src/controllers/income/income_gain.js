// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "收取收益" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const BALANCE_CONSTANTS = require("../../common/constant/balanceConstants.js");
const { getUserBalance, updateBalance, insertBalanceLog } = require("../../models/balance/index");
const { TBG_TOKEN_SYMBOL, UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const userInvestment = require("../../businessLogic/account/userInvestment.js")
const { Decimal } = require("decimal.js");
const { redis } = require("../../common");
const { startParse } = require("../../common/parseIncomeData");
const df = require("date-fns");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");

// 收取收益
async function incomeGain(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`, reqData);
        let accountName = reqData.account_name;
        let incomeType = reqData.income_type;
        const incomeTypeList = [ 
            "all", OPT_CONSTANTS.INVITE, OPT_CONSTANTS.BINGO, OPT_CONSTANTS.PK, 
            OPT_CONSTANTS.PROTECTION, OPT_CONSTANTS.HOLDER, OPT_CONSTANTS.GAME, OPT_CONSTANTS.SORT, OPT_CONSTANTS.MODE
        ];
        if (!incomeTypeList.includes(incomeType)) {
            return res.send(get_status(2002, "request params value is invalid"));
        }

        let detailArr = []
        let resDate = get_status(1);
        let incomeMap = await redis.hgetall(`tbg:income:${ accountName }`);
        // 一键收取全部收益
        if (incomeType === "all") {
            for (let key in incomeMap) {
                await startGain(incomeMap, key);
            }
            await redis.del(`tbg:income:${ accountName }`);
        } else {
            // 删掉收取过的数据，重新赋值
            await startGain(incomeMap, incomeType);
            await redis.hdel(`tbg:income:${ accountName }`, incomeType);
            incomeMap = await redis.hgetall(`tbg:income:${ accountName }`);
            const result = await startParse(incomeMap);
            detailArr.push(result);
        }

        let rows = await getUserBalance(accountName);
        logger.debug(`gain income rows: %j`, rows);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let amount = new Decimal(rows.amount);
        let data = {
            "total_income": amount.toFixed(8),
            "detail": detailArr
        }
        resDate["data"] = data;
        res.send(resDate);
    } catch (err) {
        logger.error("request income incomeGain error, the error stock is %O", err);
        throw err;
    }
}

/**
 * 按类型收取
 * @param { Object } incomeMap 
 * @param { String } incomeType 
 */
async function startGain(incomeMap, incomeType) {
    let incomeJsonIfy = incomeMap[incomeType];
    if (!incomeJsonIfy) {
        return;
    }
    // const trxList = [];
    try {
        let incomeArr = JSON.parse(incomeJsonIfy);
        for (let item of incomeArr) {
            logger.debug("item: ", item);
            const accountName = item.account_name;
            let changeAmount = new Decimal(item.change_amount);
            let rows = await getUserBalance(accountName);
            const createTime = df.format(item.create_time, "YYYY-MM-DD HH:mm:ssZ");
            const repeat_currency = await updateBalance(pool, accountName, changeAmount);
            await insertBalanceLog(pool, accountName, changeAmount.toFixed(8), changeAmount.add(rows.amount).toNumber(), item.op_type, item.extra, item.remark, createTime)
            // 如果复投资产大于投资额,自动复投生成一个子账号
            if (new Decimal(repeat_currency).gte(BALANCE_CONSTANTS.BASE_RATE)) {
                await userInvestment(BALANCE_CONSTANTS.BASE_RATE, accountName, `user ${ accountName } repeat ${ BALANCE_CONSTANTS.BASE_RATE } UE`)
            }
        }
    } catch (err) {
        throw err;
    }
}

module.exports = incomeGain;