// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/raiseBuy.js": "全球合伙人私募" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getUserAssetsPackage, insertAssertsPackage } = require("../../models/asset");
const { pool } = require("../../db");

// 全球合伙人私募
async function raiseBuy(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const { account_name: accountName, price, assets_package_id: apId } = reqData;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        if (accountInfo.account_type !== "global") {
            return res.send(get_status(1015, "this account is not a global partner"));
        }

        const userAssetsPackageInfo = await getUserAssetsPackage(accountName);
        if (userAssetsPackageInfo.length !== 0) {
            return res.send(get_status(1016, "this global partner had raised"));
        } 

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await insertAssertsPackage(client, accountName, apId, 0);
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        logger.error("request raise buy TBG error, the error stock is %O", err);
        throw err
    }
}

module.exports = raiseBuy;