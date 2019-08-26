// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/raiseAirdrop.js": "私募空投" });
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
const { insertTradeLog, updateTrade } = require("../models/trade");
const { format } = require("date-fns");


/**
 * 私募空投
 * @param {{ accountName: string, apId: number, memo: string, trId: string, price: number }} data
 */
async function raiseAirdrop(data) {
    try {
        // 获取用户私募的资产信息
        const { accountName, apId, memo, trId, price } = data;
        const assetsInfo = await getAssetsInfoById([apId]);
        const amount = new Decimal(assetsInfo[0].amount);
        const quantity = amount.mul(assetsInfo[0].release_multiple);
        const privateKeys = PRIVATE_KEY_TEST.split(",");
        logger.debug("privateKeys: ", privateKeys);
        const signatureProvider = new JsSignatureProvider(privateKeys);
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        const now = new Date();
        const tbgBalance = await getTbgBalanceInfo(accountName);
        const acCurrentBalance = new Decimal(tbgBalance.release_amount)
        // 查找推荐人
        let userReferrer = await getUserReferrer(accountName);
        let reCurrentBalance, reBalanceRemark;
        const referrerIncome = quantity.mul(TBG_ALLOCATE.RAISE_REFERRER_AIRDROP).div(TBG_ALLOCATE.BASE_RATE);
        let tmpActions = []
        // 系统第一个账户没有推荐人，多出的部分转到股东池账户
        if (!userReferrer) {
            userReferrer = TSH_INCOME;
            reCurrentBalance = new Decimal(0).add(referrerIncome);
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
                        to: TSH_INCOME,
                        quantity: `${ userReferrer.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: reBalanceRemark,
                    }
                }
            )
        } else {
            // 如果有推荐人，推荐人获得的奖励也要转入释放池
            const reTbgBalance = await getTbgBalanceInfo(userReferrer);
            reCurrentBalance = new Decimal(reTbgBalance.release_amount).add(referrerIncome);
            tmpActions.push({
                account: TBG_TOKEN_COIN,
                name: "transfer",
                authorization: [{
                    actor: TBG_TOKEN_COIN,
                    permission: 'active',
                }],
                data: {
                    from: TBG_TOKEN_COIN,
                    to: TBG_FREE_POOL,
                    quantity: `${ quantity.add(referrerIncome).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: memo,
                }
            })
        }
        reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, referrer ${ userReferrer } get airdrop ${ referrerIncome }`;
        // 销毁的额度
        const destroyAmount = amount.mul(TRADE_CONSTANTS.DESTROY);
        // 私募可得 5 倍释放 + 0.61 倍销毁
        const acCurrent = quantity.add(acCurrentBalance).add(destroyAmount).toNumber();
        // 销毁后当前额度
        const afterDestroyBalance = quantity.add(acCurrentBalance).add(-destroyAmount);
        const miningAmount = amount.mul(assetsInfo[0].mining_multiple);
        // @ts-ignore
        // 区块链事务执行
        const rpc = new JsonRpc(END_POINT, { fetch });
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
                        memo: memo,
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
                        memo: memo,
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
                        memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, destroy ${ destroyAmount.toFixed(4) }`,
                    }
                }
            ]
        }

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            // 按私募数量的 5 倍释放，直接转入私募的账户的线性释放池
            await updateTbgBalance(client, accountName, quantity.add(destroyAmount).toNumber(), 0, 0);
            // 在日志里面记录资产包信息，即交易 id，挖矿时使用
            // 挖矿的部分可以从 extra 中计算出
            const extra = { 
                "symbol": TBG_TOKEN_SYMBOL,
                "tr_id": trId,
                 ...assetsInfo[0]
            }
            await insertBalanceLog(client, accountName, quantity.add(destroyAmount).toNumber(), acCurrent, OPT_CONSTANTS.RAISE, extra, memo, now);

            // 按私募数量的 5 倍释放，直接转入私募的账户, 同时销毁一部份
            await updateTbgBalance(client, accountName, destroyAmount.toNumber(), 0, 0);
            await insertBalanceLog(client, accountName, destroyAmount.toNumber(), afterDestroyBalance, OPT_CONSTANTS.DESTROY, extra, memo, now);

            // 0.1 倍推荐奖励给推荐人
            // 如果有推荐人，更新一下推荐人的释放池
            if (!!userReferrer) {
                await updateTbgBalance(client, userReferrer, referrerIncome.toNumber(), 0, 0);
                await insertBalanceLog(client, userReferrer, referrerIncome, reCurrentBalance, OPT_CONSTANTS.RAISE, { "symbol": TBG_TOKEN_SYMBOL }, reBalanceRemark, now);
            }

            const result = await api.transact(actions, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
            
            const finishTime = format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
            const trLogId = generate_primary_key();
            const remark = `user ${ accountName } at ${ finishTime } done raise`;
            // 更新交易状态
            await updateTrade(client, trId, "finished", finishTime);
            await insertTradeLog(client, trLogId, trId, accountName, OPT_CONSTANTS.RAISE, amount.toNumber(), remark, price, amount.mul(price).toNumber(), finishTime);
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

module.exports = raiseAirdrop