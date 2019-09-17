// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/buyAlloc.js": "卖出分配" });
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
 * 用户首次买入资产空投
 * 等卖单成交以后才更新用户的信息，否则将金额退回用户账户
 * @param {{ "account_name": string, "price": number, 
 *          "amount": number, id: string, trx_amount: number, trxAmount: number
 *          "extra": { "ap_id": number }, trade_type: string, tradeOpType: string }} data
 */
async function buyAlloc(data) {
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
        let { amount, price, id: trId, account_name: accountName, trx_amount } = data;
        let trxAmount = new Decimal(data.trxAmount);
        const now = format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
        // 修改订单的状态
        const memo = `user buy ${ amount } assets, transaction ${ trxAmount.toNumber() }, get income ${ trxAmount.mul(price) }`;
        trxList.push({
            sql: insertTradeLogSql,
            values: [ generate_primary_key(), trId, "buy", amount, memo, price, amount * price, 'now()']
        })

        trxList.push({
            sql: updateTradeSql,
            values: [ data.tradeOpType, 'now()', trxAmount.toNumber(), trId ]
        });

        // 获取资产包信息
        const assetsInfo = await getAssetsInfoById([ data.extra.ap_id ]);
        // const trxAmount = new Decimal(assetsInfo[0].amount);
        // 进入释放池的额度
        const quantity = trxAmount.mul(assetsInfo[0].release_multiple);
        // 进入矿池的额度
        const miningAmount = trxAmount.mul(assetsInfo[0].mining_multiple);
        // 获得的可售额度
        const sellAmount = trxAmount.mul(assetsInfo[0].saleable_multiple);
        // 查找用户交易记录，如果没有，说明是第一次买入，此时需要给全球合伙人和全球合伙人的推荐人空投
        let opType = OPT_CONSTANTS.BUY;
        if (data.trade_type === OPT_CONSTANTS.FIRST_BUY) {
            opType = OPT_CONSTANTS.FIRST_BUY;
            const accountInfo = await getAccountInfo(accountName);
            let accountState = ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_2;
            if (accountInfo.state === ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1) {
                accountState = ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1_AND_2
            }
            
            const updateAccountStateSql = `UPDATE account SET state = $1 WHERE account_name = $2;`
            // 用户第一次投资，更新用户状态为参加 tbg1、2 或 1 2
            trxList.push({
                sql: updateAccountStateSql,
                values: [ accountState, accountName ]
            });
            // 查找用户的推荐关系，再从中找出全球合伙人
            let referrerAccountList = await getAllParentLevel(accountName);
            logger.debug("referrerAccountList: ", referrerAccountList);
            if (referrerAccountList.length === 0) {
                logger.warn("没有推荐关系，请先设置推荐关系，检查数据是否正确");
                throw Error("没有推荐关系，请先设置推荐关系，检查数据是否正确");
            }
            // 全球合伙人
            const globalAccountInfo = await getGlobalAccount(ACCOUNT_CONSTANT.ACCOUNT_TYPE.GLOBAL, referrerAccountList);
            const globalAccount = globalAccountInfo.account_name;
            let userReferrer = await getUserReferrer(globalAccount);
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            if (!userReferrer) {
                userReferrer = TSH_INCOME;
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ opType }, surplus assets airdrop ${ trxAmount.mul(0.005) } to ${ userReferrer }`;
                tmpActions.push(
                    {
                        account: TBG_TOKEN_COIN,
                        name: "transfer",
                        authorization: [{
                            actor: TBG_TOKEN_COIN,
                            permission: 'active',
                        }],
                        data: {
                            from: TBG_TOKEN_COIN,
                            to: TBG_FREE_POOL,
                            quantity: `${ trxAmount.mul(0.01).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: `user ${ accountName } at ${ now } ${ opType}, airdrop ${ trxAmount.mul(0.01) } to global account  ${ userReferrer }`,
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
                            from: TBG_TOKEN_COIN,
                            to: TSH_INCOME,
                            quantity: `${ trxAmount.mul(0.005).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: reBalanceRemark,
                        }
                    }
                )
            } else {
                // 如果有推荐人，推荐人获得的奖励也要转入释放池
                const tbgBalance = await getTbgBalanceInfo(userReferrer);
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ opType }, airdrop ${ trxAmount.mul(0.005) } to global account referrer ${ userReferrer } `;
                tmpActions.push(
                    {
                        account: TBG_TOKEN_COIN,
                        name: "transfer",
                        authorization: [{
                            actor: TBG_TOKEN_COIN,
                            permission: 'active',
                        }],
                        data: {
                            from: TBG_TOKEN_COIN,
                            to: TBG_FREE_POOL,
                            quantity: `${ trxAmount.mul(0.01).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: `user ${ accountName } at ${ now } ${ opType }, airdrop ${ trxAmount.mul(0.01) } to global account  ${ userReferrer }`,
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
                            from: TBG_TOKEN_COIN,
                            to: TBG_FREE_POOL,
                            quantity: `${ trxAmount.mul(0.005) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: reBalanceRemark,
                        }
                    }
                )

                const opts = [ accountName, trxAmount.mul(0.005), trxAmount.mul(0.005).add(tbgBalance.release_amount), OPT_CONSTANTS.FIRST_BUY_REFERRER, { "symbol": TBG_TOKEN_SYMBOL, "tr_id": trId, ...assetsInfo[0], "op_type": OPT_CONSTANTS.RELEASE }, reBalanceRemark, now ]

                trxList.push({
                    sql: insertBalanceLogSql,
                    values: opts
                });

                trxList.push({
                    sql: updateBalanceSql,
                    values: [ trxAmount.mul(0.005), 0, 0, accountName ]
                });
            }
        } else {
            // 如果不是第一次买入，只更新用户的释放资产和可售额度
            // 记录更新用户释放池资产日志
            const tbgBalance = await getTbgBalanceInfo(accountName);
            const remark = `user ${ accountName } at ${ now } ${ opType }, transaction ${ trxAmount.toNumber() }, add release_amount ${ quantity } `;
            trxList.push({
                sql: insertBalanceLogSql,
                values: [ accountName, quantity.toNumber(), quantity.add(tbgBalance.release_amount).toNumber(), opType, { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE }, remark, 'now()' ]
            });

            // 记录更新用户可售额度日志
            const remark1 = `user ${ accountName } at ${ now } ${ opType }, add sell_amount ${ sellAmount } `;
            trxList.push({
                sql: insertBalanceLogSql,
                values: [ accountName, sellAmount.toNumber(), sellAmount.add(tbgBalance.sell_amount).toNumber(), opType, { "symbol": TBG_TOKEN_SYMBOL, "op_type": 'sell_amount' }, remark1, now ]
            });

            // 更新用户的释放资产和可售额度
            trxList.push({
                sql: updateBalanceSql,
                values: [ quantity.toNumber(), sellAmount.toNumber(), 0, accountName ]
            });
        }

        let actions = {
            actions: [
                ...tmpActions,
                {
                    account: TBG_TOKEN_COIN,
                    name: "transfer",
                    authorization: [{
                        actor: TBG_TOKEN_COIN,
                        permission: 'active',
                    }],
                    data: {
                        from: TBG_TOKEN_COIN,
                        to: TBG_FREE_POOL,
                        quantity: `${ quantity.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: `user ${ accountName } at ${ now } buy assets package, transfer to ${ TBG_FREE_POOL }`,
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
                        from: TBG_TOKEN_COIN,
                        to: TBG_MINE_POOL,
                        quantity: `${ miningAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: `user ${ accountName } at ${ now } buy assets package, transfer to ${ TBG_MINE_POOL }`,
                    }
                }
            ]
        }
        return {
            actionsList: actions.actions,
            queryList: trxList
        }
    } catch (err) {
        logger.error("buy Alloc error, the error stock is %O", err);
        throw err;
    }
}

module.exports = buyAlloc