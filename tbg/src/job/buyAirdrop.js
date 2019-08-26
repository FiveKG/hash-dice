// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/buyAirdrop.js": "购买资产包" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const { getUserReferrer } = require("../models/referrer");
const { getBalanceLogInfo } = require("../models/balanceLog");
const { TSH_INCOME, TBG_MINE_POOL, TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { getAssetsInfoById } = require("../models/asset");
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { insertBalanceLog } = require("../models/balance");
const { updateTbgBalance, getTbgBalanceInfo } = require("../models/tbgBalance");
const TRADE_CONSTANTS = require("../common/constant/tradeConstant.js");
const { generate_primary_key } = require("../common/index.js");
const { getAllParentLevel, updateAccountState, getAccountInfo } = require("../models/account")
const { insertTradeLog, updateTrade, getTradeInfoHistory } = require("../models/trade");
const { format } = require("date-fns");


/**
 * 用户首次买入资产空投
 * @param {{ accountName: string, apId: number }} data
 */
async function buyAirdrop(data) {
    try {
        const trxList = [];
        let tmpActions = []
        let sql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra，remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        // 减去用户释放池资产，更新可售余额
        const updateBalanceSql = `
            UPDATE tbg_balance 
                SET release_amount = release_amount + $1, 
                    sell_amount = sell_amount + $2,  
                    active_amount = active_amount + $3
                WHERE account_name = $4
        `
        const { accountName, apId } = data;
        const now = new Date();
        // 获取资产包信息
        const assetsInfo = await getAssetsInfoById([apId]);
        const amount = new Decimal(assetsInfo[0].amount);
        // 进入释放池的额度
        const quantity = amount.mul(assetsInfo[0].release_multiple);
        // 进入矿池的额度
        const miningAmount = amount.mul(assetsInfo[0].mining_multiple);
        // 获得的可售额度
        const sellAmount = amount;
        // 查找用户交易记录，如果没有，说明是第一次买入，此时需要给全球合伙人和全球合伙人的推荐人空投
        const tradeInfo = await getTradeInfoHistory({ "tradeType": "buy", "accountName": accountName, orderBy: "ASC" });
        if (tradeInfo.length === 0) {
            let referrerAccountList = await getAllParentLevel(accountName);
            logger.debug("referrerAccountList: ", referrerAccountList);
            if (referrerAccountList.length === 0) {
                logger.warn("没有推荐关系，请先设置推荐关系，检查数据是否正确");
                throw Error("没有推荐关系，请先设置推荐关系，检查数据是否正确");
            }
            // 全球合伙人
            const globalAccount = referrerAccountList[1];
            let userReferrer = await getUserReferrer(globalAccount);
            // 系统第一个账户没有推荐人，多出的部分转到股东池账户
            if (!userReferrer) {
                userReferrer = TSH_INCOME;
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.FIRST_BUY }, surplus assets airdrop ${ amount.mul(0.005) } to ${ userReferrer }`;
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
                            quantity: `${ amount.mul(0.01).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.FIRST_BUY }, airdrop ${ amount.mul(0.01) } to global account  ${ userReferrer }`,
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
                            quantity: `${ amount.mul(0.005).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: reBalanceRemark,
                        }
                    }
                )
            } else {
                // 如果有推荐人，推荐人获得的奖励也要转入释放池
                const tbgBalance = await getTbgBalanceInfo(userReferrer);
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.FIRST_BUY }, airdrop ${ amount.mul(0.005) } to global account referrer ${ userReferrer } `;
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
                            quantity: `${ amount.mul(0.01).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.FIRST_BUY }, airdrop ${ amount.mul(0.01) } to global account  ${ userReferrer }`,
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
                            quantity: `${ amount.mul(0.005) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: reBalanceRemark,
                        }
                    }
                )

                const opts = [ accountName, amount.mul(0.005), amount.mul(0.005).add(tbgBalance.release_amount), OPT_CONSTANTS.FIRST_BUY, { "symbol": TBG_TOKEN_SYMBOL }, reBalanceRemark, now ]

                trxList.push({
                    sql: sql,
                    values: opts
                });

                trxList.push({
                    sql: updateBalanceSql,
                    values: [ amount.mul(0.005), 0, 0, accountName ]
                });
            }
        } else {
            // 如果不是第一次买入，只更新用户的释放资产和可售额度
            // 记录更新用户释放池资产日志
            const tbgBalance = await getTbgBalanceInfo(accountName);
            const remark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.FIRST_BUY }, add release_amount ${ quantity } `;
            trxList.push({
                sql: sql,
                values: [ accountName, quantity, quantity.add(tbgBalance.release_amount), OPT_CONSTANTS.BUY, { }, remark, now ]
            });

            // 记录更新用户可售额度日志
            const remark1 = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.FIRST_BUY }, add sell_amount ${ sellAmount } `;
            trxList.push({
                sql: sql,
                values: [ accountName, sellAmount, sellAmount.add(tbgBalance.sell_amount), OPT_CONSTANTS.BUY, { }, remark1, now ]
            });

            // 更新用户的释放资产和可售额度
            trxList.push({
                sql: updateBalanceSql,
                values: [ quantity, sellAmount, 0, accountName ]
            });
        }
        
        const signatureProvider = new JsSignatureProvider([ PRIVATE_KEY_TEST ]);
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // @ts-ignore
        // 区块链事务执行
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
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

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                client.query(it.sql, it.values);
            }));

            const result = await api.transact(actions, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
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

module.exports = buyAirdrop