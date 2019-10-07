// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取普通买入交易信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const asset = require("../../models/asset");
const { getAccountInfo } = require("../../models/account");
const { redis } = require("../../common");
const { OPENING_PRICE_KEY, BUY_START_TIME, BUY_END_TIME, FIRST_BUY, OPENING_PRICE } = require("../../common/constant/tradeConstant.js");
const { ACCOUNT_TYPE } = require("../../common/constant/accountConstant");
const { Decimal } = require("decimal.js");

// 获取普通买入交易信息
async function getBuyAssetsInfo(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        // 获取全球合伙人私募资产包信息
        const assets_info = []
        if (accountInfo.account_type === ACCOUNT_TYPE.GLOBAL) {
            const assetsInfo = await asset.getAssetsInfo(ACCOUNT_TYPE.GLOBAL);
            const detail = assetsInfo.map(it => {
                const amount = new Decimal(it.amount)
                return {
                    id: it.id,
                    amount: amount.toNumber(),
                    release_pool: amount.mul(it.release_multiple),
                    mining_pool: amount.mul(it.mining_multiple),
                    saleable_amount: amount.mul(it.saleable_multiple)
                }
            });
            assets_info.push(...detail);
        } else {
            const assetsInfo = await asset.getAssetsInfo("common");
            const detail = assetsInfo.map(it => {
                const amount = new Decimal(it.amount)
                return {
                    id: it.id,
                    amount: amount.toNumber(),
                    release_pool: amount.mul(it.release_multiple),
                    mining_pool: amount.mul(it.mining_multiple),
                    saleable_amount: amount.mul(it.saleable_multiple)
                }
            });
            assets_info.push(...detail);
        }
        
        // 获取开盘价格
        const openingPrice = await redis.get(OPENING_PRICE_KEY) || OPENING_PRICE;
        resData.data = {
            "price": new Decimal(openingPrice).toNumber(),
            "assets_info": assets_info,
            "first_buy": [ FIRST_BUY, BUY_END_TIME ].join(','),
            "buy_time": [ BUY_START_TIME, BUY_END_TIME ].join(',')
        }
        return res.send(resData);
    } catch (err) {
        logger.error("request getBuyAssetsInfo error, the error stock is %O", err);
        throw err
    }
}

module.exports = getBuyAssetsInfo;