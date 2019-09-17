// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "user sell asset package" });
const { redis, generate_primary_key } = require("../common");
const { RAISE, BUY, FIRST_BUY, SELL } = require("../common/constant/optConstants");
const { OPENING_PRICE_KEY, DESTROY, SELL_FEE, BASE_RATE } = require("../common/constant/tradeConstant.js");
const { pool, psSellAssets } = require("../db/index.js");
const { Decimal } = require("decimal.js");
const { insertTradeLog, updateTrade, getTradeInfo } = require("../models/trade");
const { format } = require("date-fns");

/**
 * 
 * @param {{ accountName: string, price: number, trade_amount: number }} data 
 */
async function sellAssets(data) {
    try {
        const { accountName, price, trade_amount } = data;
        const tradeInfo = await getTradeInfo(accountName, SELL);
        logger.debug("tradeInfo: ", tradeInfo);
        // 没有交易记录，不做处理
        if (tradeInfo.length === 0) {
            return;
        }

        // 总价除去价格得到交易数量
        const tradeAmount = new Decimal(trade_amount);
        // 拿出排在前面的订单
        const trxInfo = tradeInfo.filter(it => it.state === "create" && tradeAmount.eq(it.amount)).shift();
        logger.debug("trxInfo: ", trxInfo);
        if (!trxInfo) {
            return;
        }
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            const finishTime = format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
            const trLogId = generate_primary_key();
            const remark = `user ${ accountName } at sell ${ tradeAmount.toNumber() } asset, trade waiting`;
            // 更新交易状态
            await updateTrade(client, trxInfo.id, "wait", finishTime);
            await insertTradeLog(client, trLogId, trxInfo.id, trxInfo.trade_type, trxInfo.amount, remark, trxInfo.price, tradeAmount.mul(price).toNumber(), finishTime);
            await client.query("COMMIT");
            // 发送卖出的消息
            const sellFee = tradeAmount.mul(price).mul(SELL_FEE / BASE_RATE);
            const destroyAmount = tradeAmount.mul(DESTROY / BASE_RATE);
            const sellData = {
                "account_name": accountName,
                "price":  price,
                "trId": trxInfo.id,
                "amount": trxInfo.amount,
                "sell_fee": sellFee.toFixed(4),
                "destroy": destroyAmount.toFixed(4),
                "income": tradeAmount.mul(price).minus(sellFee).minus(destroyAmount).toFixed(4),
                "create_time": finishTime
            }
            await psSellAssets.pub(sellData);
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        throw err;
    }
}

module.exports = sellAssets;