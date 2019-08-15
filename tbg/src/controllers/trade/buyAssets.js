// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/buyAssets.js": "买入资产包" });
const { get_status, inspect_req_data, generate_primary_key } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getAssetsInfoById } = require("../../models/asset");
const { insertTrade, insertTradeLog } = require("../../models/trade");
const { pool } = require("../../db");
const { format } = require("date-fns");
const { Decimal } = require("decimal.js");

// 买入资产包
async function buyAssets(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const { account_name: accountName, price, assets_package_id: apId } = reqData;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        const assetsInfo = await getAssetsInfoById(apId);
        if (!assetsInfo) {
            return res.send(get_status(1017, "this assets package does not exists"));
        }

        const trId = generate_primary_key();
        const trLogId = generate_primary_key();
        const createTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
        const finishedTime = format(new Date(1970, 0, 1), "YYYY-MM-DD : HH:mm:ssZ");
        const amount = new Decimal(assetsInfo.amount);
        const volume = amount.mul(price);
        const memo = `user ${ accountName } at ${ createTime } buy a ${ amount.toNumber() } assets package`;
        const tradeType = "buy";
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await insertTrade(client, trId, accountName, tradeType, { "ap_id": apId }, amount.toNumber(), 0, price, "create", createTime, finishedTime);
            await insertTradeLog(client, trLogId, trId, tradeType, amount.toNumber(), memo, price, volume.toNumber(), createTime);
            // todo 
            // 空投 TBG
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
        res.send(get_status(1));
    } catch (err) {
        logger.error("request buyAssets error, the error stock is %O", err);
        throw err
    }
}

module.exports = buyAssets;