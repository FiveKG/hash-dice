// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/sellAssets.js": "卖出 TBG" });
const { get_status, inspect_req_data, generate_primary_key } = require("../../common/index.js");
const { getAccountInfo, getAccountMemberLevel } = require("../../models/account");
const { getAssetsInfoById } = require("../../models/asset");
const { insertTrade, insertTradeLog } = require("../../models/trade");
const { updateTbgBalance, getTbgBalanceInfo } = require("../../models/tbgBalance");
const { UE_TOKEN, WALLET_RECEIVER, TBG_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { MEMBER_LEVEL_TRX } = require("../../common/constant/assetsConstant.js");
const { userMember } = require("../../common/userMember.js");
const { pool, psSellAssets } = require("../../db");
const { format } = require("date-fns");
const { Decimal } = require("decimal.js");

// 卖出 TBG
async function sellAssets(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const { account_name: accountName, price, amount, sell_fee, destroy, income } = reqData;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        const sellAmount = new Decimal(amount);
        const trxInfo = MEMBER_LEVEL_TRX[userMember(userMemberLevel.count).ID];

        // 如果低于用户一次最低可卖的数量或者高于一次最高可卖数量
        if (sellAmount.lessThan(trxInfo.ONE_MIN_TRX)) {
            return res.send(get_status(1021, "less then one trade min amount")); 
        }

        if (!sellAmount.lessThanOrEqualTo(trxInfo.ONE_MAX_TRX)) {
            return res.send(get_status(1022, "more then one trade max amount")); 
        }

        const sql = `SELECT * FROM trade WHERE account_name = $1 AND trade_type = $2 AND create_time > current_date`;
        const { rows } = await pool.query(sql, [ accountName, 'sell' ]);
        // 检查是否超过一天可卖的次数
        if (rows.length > trxInfo.DAY_TRX_COUNT) {
            return res.send(get_status(1023, "more than one day to sell count")); 
        }

        // todo 检查用户的可用余额是否足够
        // 根据用户等级计算每日可卖出次数，超过不可交易
        // 如果可用余额不足，返回余额不足
        const tbgBalance = await getTbgBalanceInfo(accountName);
        if (new Decimal(tbgBalance.active_amount).lessThan(amount)) {
            return res.send(get_status(1011, "insufficient balance"));
        }
        const trId = generate_primary_key();
        const trLogId = generate_primary_key();
        const createTime = format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
        const finishedTime = format(new Date(1970, 0, 1), "YYYY-MM-DD HH:mm:ssZ");
        // const sellAmount = new Decimal(amount);
        const volume = sellAmount.mul(price);
        const memo = `user ${ accountName } at ${ createTime } sell a ${ sellAmount.toNumber() } assets`;
        const tradeType = "sell";
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await insertTrade(client, trId, accountName, tradeType, { "symbol": TBG_TOKEN_SYMBOL }, sellAmount.toNumber(), 0, price, "create", createTime, finishedTime);
            await insertTradeLog(client, trLogId, trId, tradeType, sellAmount.toNumber(), memo, price, volume.toNumber(), createTime);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
        res.send(get_status(1));

    } catch (err) {
        logger.error("request sellAssets error, the error stock is %O", err);
        throw err
    }
}

module.exports = sellAssets;