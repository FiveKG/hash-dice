// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/wringTrade.js": "撮合交易" });
const { TRADE_ORDER_RATE, BUY_END_TIME, BUY_START_TIME, BASE_RATE } = require("../common/constant/tradeConstant");
const {  SELL } = require("../common/constant/optConstants");
const df = require("date-fns");
const { Decimal } = require("decimal.js");
const { scheduleJob } = require("node-schedule");

logger.debug(`beginListenAction running...`);
scheduleJob("* */5 * * * *", wringTrade);

/***
 * 撮合交易，根据比例，每五分钟撮合一次，交易量不足时由平台插单
 */
async function wringTrade() {
    try {
        const now = new Date();
        const dayStart = df.startOfDay(now);
        const startTime = df.addHours(dayStart, BUY_START_TIME);
        const endTime = df.addHours(dayStart, BUY_END_TIME);
        // 如果在不再交易时间内, 交易结束时，没有完成的订单全部撤销，资金原路退回
        if (!df.isWithinRange(startTime, now, endTime)) {
            
        } else {
            const sql = `
                SELECT * FROM trade ORDER BY create_time DESC;
            `
            const { rows: tradeInfo } = await pool.query(sql);
            const buyOrder = tradeInfo.filter(it => it.trade_type !== SELL && (it.state === "finished" || it.state === "wait"));
            const sellOrder = tradeInfo.filter(it => it.trade_type === SELL && (it.state === "finished" || it.state === "wait"));
            // 如果没有订单，不做处理
            if (tradeInfo.length === 0) {
                return;
            } else {
                const rate = new Decimal(TRADE_ORDER_RATE).div(BASE_RATE);
                // 如果没有买单, 不做处理
                if (buyOrder.length === 0) {
                    return;
                } else if (sellOrder.length === 0) {
                    // 如果没有卖单
                    const orderCount = Math.ceil(rate.mul(buyOrder.length).toNumber());
                    const waitOrder = buyOrder.filter(it => it.state === "wait").splice(0, orderCount);
                } else {
                    const buyToSell = sellOrder.length / buyOrder.length;
                    // 当比例< 30% 时
                    if (!rate.lessThan(buyToSell)) {
                        return;
                    } else {
                        const orderCount = Math.ceil(rate.minus(buyToSell).mul(buyOrder.length).toNumber());
                        const waitOrder = buyOrder.filter(it => it.state === "wait").splice(0, orderCount);
                    }
                }
            }            
        }
    } catch (err) {
        throw err;
    }
}

module.exports = wringTrade;