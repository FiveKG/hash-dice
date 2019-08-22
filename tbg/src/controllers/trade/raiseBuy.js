// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/raiseBuy.js": "全球合伙人私募" });
const { get_status, inspect_req_data, generate_primary_key } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getAssetsInfoById } = require("../../models/asset");
const { insertTrade, insertTradeLog, getTradeInfo } = require("../../models/trade");
const { pool, psRaise } = require("../../db");
const { format } = require("date-fns");
const { insertAccountOp } = require("../../models/accountOp");
const { Decimal } = require("decimal.js");
const { AIRDROP, MINING_AIRDROP_ID } = require("../../common/constant/tbgAllocateRate");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { TBG_TOKEN_SYMBOL, TBG_TOKEN } = require("../../common/constant/eosConstants");
const { getCurrencyStats } = require("../../job/getTrxAction.js");
const { getSystemLogInfo } = require("../../models/systemOpLog");

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

        // 只有全球合伙人才能私募
        if (accountInfo.account_type !== "global") {
            return res.send(get_status(1015, "this account is not a global partner"));
        }

        const tradeType = "raise";
        const tradeInfo = await getTradeInfo(accountName, tradeType);
        // 只能私募一次
        if (tradeInfo.length !== 0) {
            return res.send(get_status(1016, "this global partner had raised"));
        }

        const assetsInfo = await getAssetsInfoById(apId);
        if (assetsInfo.length === 0) {
            return res.send(get_status(1017, "this assets package does not exists"));
        }

        const trId = generate_primary_key();
        const trLogId = generate_primary_key();
        const createTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
        const finishedTime = format(new Date(1970, 0, 1), "YYYY-MM-DD : HH:mm:ssZ");
        const amount = new Decimal(assetsInfo[0].amount);
        const volume = amount.mul(price);
        const memo = `user ${ accountName } at ${ createTime } raised a ${ amount.toNumber() } assets package`;

        const { [TBG_TOKEN_SYMBOL]: { max_supply } } = await getCurrencyStats(TBG_TOKEN, TBG_TOKEN_SYMBOL);
        // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
        const maxSupply = new Decimal(max_supply.split(" ")[0]);

        // 查询用户的签到空投记录
        const systemOpLogInfo = await getSystemLogInfo(TBG_TOKEN);
        const raiseInLog = systemOpLogInfo.find(q => q.op_type === OPT_CONSTANTS.RAISE);
        const raiseAirdropInfo = AIRDROP.find(it => it.id === MINING_AIRDROP_ID);
        
        // 如果到达空投占比，则不再空投
        const quantity = !!raiseInLog ? new Decimal(raiseInLog.total).add(amount) : 0;
        if (maxSupply.mul(raiseAirdropInfo.rate).lessThan(quantity)) {
            return res.send(get_status(1018, "check in airdrop quota has been used up"))
        }

        
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await insertAccountOp(client, accountName, tradeType, memo);
            await insertTrade(client, trId, accountName, tradeType, { "ap_id": apId }, amount.toNumber(), 0, price, "create", createTime, finishedTime);
            await insertTradeLog(client, trLogId, trId, tradeType, amount.toNumber(), memo, price, volume.toNumber(), createTime);
            await client.query("COMMIT");
            // todo 
            // 空投 TBG
            const raiseData = {
                "accountName": accountName,
                "ap_id": apId,
                "memo": memo
            }
            await psRaise.pub(raiseData)
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
        res.send(get_status(1));
    } catch (err) {
        logger.error("request raise buy TBG error, the error stock is %O", err);
        throw err
    }
}

module.exports = raiseBuy;