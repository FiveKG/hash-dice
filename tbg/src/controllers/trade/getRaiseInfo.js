// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "// 获取全球合伙人私募信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const asset = require("../../models/asset");
const { redis } = require("../../common");
const { OPENING_PRICE_KEY, RAISE_PRICE, BASE_RATE, OPENING_PRICE } = require("../../common/constant/tradeConstant.js");
const { Decimal } = require("decimal.js");
const { pool } = require("../../db/index.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");

// 获取全球合伙人私募信息
async function getRaiseInfo(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        // 获取全球合伙人私募资产包信息
        const assetsInfo = await asset.getAssetsInfo("raise");
        const assets_info = assetsInfo.map(it => {
            return {
                id: it.id,
                amount: new Decimal(it.amount).toNumber(),
                release_pool: new Decimal(it.release_multiple).mul(it.amount),
                mining_pool: new Decimal(it.mining_multiple).mul(it.amount)
            }
        });
        // 获取开盘价格
        const openingPrice = await redis.get(OPENING_PRICE_KEY) || OPENING_PRICE;
        // 查找全球合伙人私募人数
        const selectRaiseSql = `SELECT count(1)::INTEGER FROM balance_log WHERE op_type = $1`;
        const { rows: [ { count } ] } = await pool.query(selectRaiseSql, [ OPT_CONSTANTS.RAISE ]);
        if (count > 500) {
            logger.debug("raise airdrop quota has been used up");
            return;
        }

        const raisePrice = new Decimal(openingPrice).mul(setRate(count));
        resData.data = {
            "price": new Decimal(openingPrice).toNumber(),
            "raise_price": raisePrice.toFixed(4),
            "assets_info": assets_info
        }
        return res.send(resData);
    } catch (err) {
        logger.error("request getRaiseInfo error, the error stock is %O", err);
        throw err
    }
}

module.exports = getRaiseInfo;

/**
 * 设置分配比例
 * @param { number } position 
 */
function setRate(position) {
    if (position <= 100) {
        return 50 / 100;
    } else if (position <= 200) {
        return 55 / 100;
    } else if (position <= 300) {
        return 60 / 100;
    } else if (position <= 400) {
        return 65 / 100;
    } else {
        return 70 / 100;
    }
}