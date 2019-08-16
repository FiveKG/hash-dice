// @ts-check

const logger = require("../../common/logger.js").child({ "@controllers/trade/getSellAssetsInfo.js": "获取普通卖出交易信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo, getAccountMemberLevel } = require("../../models/account");
const { redis } = require("../../common");
const { OPENING_PRICE_KEY, DESTROY, SELL_START_TIME, SELL_END_TIME, SELL_FEE, OPENING_PRICE } = require("../../common/constant/tradeConstant.js");
const { MEMBER_LEVEL_TRX } = require("../../common/constant/assetsConstant.js");
const { Decimal } = require("decimal.js");
const { userMember } = require("../../common/userMember.js");

// 获取普通卖出交易信息
async function getSellAssetsInfo(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
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
        resData.data = {
            "price": new Decimal(openingPrice).toNumber(),
            "sell_fee_rate": SELL_FEE,
            "destroy_rate": DESTROY,
            "sell_time": [ SELL_START_TIME, SELL_END_TIME ].join(","),
            "one_trx": MEMBER_LEVEL_TRX[levelInfo.ID].ONE_MAX_TRX,
            "day_trx": MEMBER_LEVEL_TRX[levelInfo.ID].DAY_MAX_TRX,
            "trx_day_count": MEMBER_LEVEL_TRX[levelInfo.ID].DAY_TRX_COUNT,
            "level": levelInfo.NAME
        }
        res.send(resData);
    } catch (err) {
        logger.error("request getSellAssetsInfo TBG error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getSellAssetsInfo;