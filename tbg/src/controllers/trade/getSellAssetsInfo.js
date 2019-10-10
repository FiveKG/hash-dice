// @ts-check

const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取普通卖出交易信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo, getAccountMemberLevel } = require("../../models/account");
const { redis } = require("../../common");
const { OPENING_PRICE_KEY, DESTROY, SELL_START_TIME, SELL_END_TIME, SELL_FEE, OPENING_PRICE, BASE_RATE } = require("../../common/constant/tradeConstant.js");
const { MEMBER_LEVEL_TRX } = require("../../common/constant/assetsConstant.js");
const { Decimal } = require("decimal.js");
const { userMember } = require("../../common/userMember.js");

// 获取普通卖出交易信息
async function getSellAssetsInfo(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const sellAmount = reqData.amount;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        const levelInfo = userMember(userMemberLevel.count);
        let resData = get_status(1);
        // 获取开盘价格
        const openingPrice = await redis.get(OPENING_PRICE_KEY) || OPENING_PRICE;
        let obj = {}
        if (!!sellAmount) {
            const sellFeeAmount = new Decimal(sellAmount).mul(openingPrice).mul(SELL_FEE).div(BASE_RATE).toFixed(4);
            const income = new Decimal(sellAmount).mul(openingPrice).mul(BASE_RATE - SELL_FEE).div(BASE_RATE).toFixed(4);
            const destroyAmount = new Decimal(sellAmount).mul(openingPrice).mul(DESTROY).div(BASE_RATE).toFixed(4);
            obj = {
                "sell_fee_amount": sellFeeAmount,
                "destroy_amount": destroyAmount,
                "income": income
            }
        }
        resData.data = {
            "price": new Decimal(openingPrice).toNumber(),
            "sell_fee_rate": SELL_FEE,
            "destroy_rate": DESTROY,
            "sell_time": [ SELL_START_TIME, SELL_END_TIME ].join(","),
            "one_trx": MEMBER_LEVEL_TRX[levelInfo.ID].ONE_MAX_TRX,
            "day_trx": MEMBER_LEVEL_TRX[levelInfo.ID].DAY_MAX_TRX,
            "trx_day_count": MEMBER_LEVEL_TRX[levelInfo.ID].DAY_TRX_COUNT,
            "level": levelInfo.NAME,
            ...obj
        }
        res.send(resData);
    } catch (err) {
        logger.error("request getSellAssetsInfo TBG error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getSellAssetsInfo;