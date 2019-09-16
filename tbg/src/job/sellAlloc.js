// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "卖出分配" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TRADE_CONSTANTS = require("../common/constant/tradeConstant");
const { getUserReferrer } = require("../models/referrer");
const { TSH_INCOME, TBG_MINE_POOL, TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { getAssetsInfoById } = require("../models/asset");
const { getTbgBalanceInfo } = require("../models/tbgBalance");
const { getAllParentLevel, getGlobalAccount } = require("../models/account")
const ACCOUNT_CONSTANT = require("../common/constant/accountConstant.js");
const { getTradeInfo } = require("../models/trade");
const { getAccountInfo } = require("../models/account");
const { TBG_TOKEN_SYMBOL, WALLET_RECEIVER, UE_TOKEN, UE_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { generate_primary_key } = require("../common/index.js");
const { getAllTrade } = require("../models/trade");
const { format } = require("date-fns");

/**
 * @param {{ "account_name": string, "price": number, 
 *          "amount": number, id: string, trx_amount: number, trxAmount: number
 *          "extra": { "ap_id": number }, trade_type: string, tradeOpType: string }} data
 */
async function sellAlloc(data) {
    try {
        const trxList = [];
        let tmpActions = []
        let insertBalanceLogSql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra, remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        const updateBalanceSql = `
            UPDATE tbg_balance 
                SET release_amount = release_amount + $1, 
                    sell_amount = sell_amount + $2,  
                    active_amount = active_amount + $3
                WHERE account_name = $4
        `
        const updateTradeSql = `
            UPDATE trade SET state = $1, finished_time = $2, trx_amount = trx_amount + $3 WHERE id = $4
        `
        const insertTradeLogSql = `
            INSERT INTO trade_log(id, tr_id, trade_type, amount, memo, price, volume, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8);
        `
        let { amount, price, id: trId, account_name: accountName } = data;
        let trxAmount = new Decimal(data.trxAmount);
        const now = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");

        // 卖出后，减去用户的可售余额和可售额度
        const tbgBalance = await getTbgBalanceInfo(accountName);
        const sellEnableExtra = { "symbol": TBG_TOKEN_SYMBOL, "op_type": 'sell_amount' };
        const activeAmountExtra = { "symbol": TBG_TOKEN_SYMBOL, "op_type": 'active_amount' };
        const remark1 = `user sell ${ amount } assets, transaction ${ trxAmount.toNumber() }, minus ${ trxAmount.toNumber() } sell_amount`;
        const remark2 = `user sell ${ amount } assets, transaction ${ trxAmount.toNumber() }, minus ${ trxAmount.toNumber() } active_amount`;
        // 可售额度
        const sellEnable = new Decimal(tbgBalance.sell_amount).minus(trxAmount).toNumber();
        // 可售余额
        const activeAmount = new Decimal(tbgBalance.sell_amount).minus(trxAmount).toNumber();
        // 添加更新用户可售额度日志
        trxList.push({
            sql: insertBalanceLogSql,
            values: [ accountName, -trxAmount.toNumber(), sellEnable, OPT_CONSTANTS.SELL, sellEnableExtra, remark1, now ]
        });
        // 添加更新用户可售余额日志
        trxList.push({
            sql: insertBalanceLogSql,
            values: [ accountName, -trxAmount.toNumber(), activeAmount, OPT_CONSTANTS.SELL, activeAmountExtra, remark2, now ]
        });
        // 更新额度
        trxList.push({
            sql: updateBalanceSql,
            values: [ 0, -trxAmount.toNumber(), -trxAmount.toNumber(), accountName ]
        })

        // 修改卖出订单的状态
        const memo = `user sell ${ amount } assets, transaction ${ trxAmount.toNumber() }, get income ${ trxAmount.mul(price) }`;
        trxList.push({
            sql: insertTradeLogSql,
            values: [ generate_primary_key(), trId,  "sell", amount, memo, price, amount * price, 'now()']
        })

        trxList.push({
            sql: updateTradeSql,
            values: [ data.tradeOpType, 'now()', trxAmount.toNumber(), trId ]
        });

        // 总价
        const totalAmount = new Decimal(amount).mul(price);
        // 销毁数量
        const destroyAmount = totalAmount.mul(TRADE_CONSTANTS.DESTROY / TRADE_CONSTANTS.BASE_RATE);
        // 手续费
        const fee = totalAmount.mul(TRADE_CONSTANTS.SELL_FEE / TRADE_CONSTANTS.BASE_RATE);
        // 实际收入 总价 - 手续费
        const incomeAmount = totalAmount.minus(fee);
        
        // 卖出需要销毁一部分额度
        // 监听转账时，用户一次将所有的 TBG 代币都转到了 TBG_FREE_POOL，所以需要从 TBG_FREE_POOL 再转回发币账户，只能用发币账户销毁
        tmpActions.push(
            {
                account: UE_TOKEN,
                name: "transfer",
                authorization: [{
                    actor: WALLET_RECEIVER,
                    permission: 'active',
                }],
                data: {
                    from: WALLET_RECEIVER,
                    to: accountName,
                    quantity: `${ incomeAmount.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                    memo: `user ${ accountName } sell ${ amount } TBG, transaction ${ trxAmount.toNumber() }, get ${ incomeAmount.toFixed(4) } UE`,
                }
            },
            {
                account: TBG_TOKEN_COIN,
                name: "transfer",
                authorization: [{
                    actor: TBG_TOKEN_COIN,
                    permission: 'active',
                }],
                data: {
                    from: TBG_FREE_POOL,
                    to: TBG_TOKEN_COIN,
                    quantity: `${ destroyAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: `user ${ accountName } sell ${ amount } TBG, transaction ${ trxAmount.toNumber() }, transfer to ${ TBG_TOKEN_COIN } destroy`,
                }
            },
            {
                account: TBG_TOKEN_COIN,
                name: "retire",
                authorization: [{
                    actor: TBG_TOKEN_COIN,
                    permission: 'active',
                }],
                data: {
                    quantity: `${ destroyAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.SELL }, transaction ${ trxAmount.toNumber() }, destroy ${ destroyAmount.toFixed(4) }`,
                }
            }
        )
        return {
            actionsList: tmpActions,
            queryList: trxList
        }
    } catch (err) {
        logger.error("sell allocate assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = sellAlloc