// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "调整价格" });
const { Decimal } = require("decimal.js");
const { MAX_RISE_PRICE, MIN_RISE_PRICE, OPENING_PRICE_KEY } = require("../common/constant/tradeConstant");
const { redis } = require("../common");
const { scheduleJob } = require("node-schedule");

logger.debug(`beginListenAction running...`);
// 每天 0：00 调整价格
scheduleJob("0 0 0 */1 * *", adjustPrice);

/**
 * 调整价格
 * tbg 交易价格每天零点按一定范围随机上涨
 */
async function adjustPrice() {
    try {
        // 获取到当前的价格
        const openPrice = await redis.get(OPENING_PRICE_KEY);
        // 0.005 - 0.015
        // random [0, 1)
        // 随机上涨的幅度
        const risePrice = Math.random() * (MAX_RISE_PRICE - MIN_RISE_PRICE) + MIN_RISE_PRICE;
        // 最新价格
        const latestPrice = new Decimal(risePrice).add(openPrice).toFixed(4);
        await redis.set(OPENING_PRICE_KEY, latestPrice);
    } catch (err) {
        logger.error("adjust price error, the error stock is %O", err);
        throw err;
    }
}

module.exports = adjustPrice