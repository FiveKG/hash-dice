// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/buyAssets.js": "购买资产包" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const { getAssetsInfoById } = require("../models/asset");
const { insertTradeLog, updateTrade, getTradeInfoHistory, getTradeInfo } = require("../models/trade");
const { generate_primary_key } = require("../common/index.js");
const { format } = require("date-fns");

/**
 * 监听到用户转账后，更改用交易状态, 在用户卖单或者是平台插单时再空投
 * @param {{ accountName: string, price: number, apId: number }} data
 */
async function buyAssets(data) {
    try {
        const { accountName, price, apId } = data;
        let opType = OPT_CONSTANTS.BUY;
        const tradeInfo = await getTradeInfo(accountName, opType);
        // 没有交易记录，不做处理
        if (tradeInfo.length === 0) {
            return;
        }
        // 拿出排在前面的订单
        const trxInfo = tradeInfo.filter(it => it.state === "create" && it.extra.ap_id === apId).shift();
        if (!trxInfo) {
            return;
        }
        // 获取资产包信息
        const assetsInfo = await getAssetsInfoById([apId]);
        const amount = new Decimal(assetsInfo[0].amount);
        // 查找用户交易记录，如果没有，说明是第一次买入，此时需要给全球合伙人和全球合伙人的推荐人空投
        const firstTrade = tradeInfo.filter(it => it.trade_type === OPT_CONSTANTS.FIRST_BUY);
        if (firstTrade.length === 1) {
            opType = OPT_CONSTANTS.FIRST_BUY;
        }
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            const finishTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
            const trLogId = generate_primary_key();
            const remark = `user ${ accountName } at buy ${ amount } asset, trade waiting`;
            // 更新交易状态
            await updateTrade(client, trxInfo.id, "wait", finishTime);
            await insertTradeLog(client, trLogId, trxInfo.id, opType, amount.toNumber(), remark, price, amount.mul(price).toNumber(), finishTime);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        logger.error("raise airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = buyAssets