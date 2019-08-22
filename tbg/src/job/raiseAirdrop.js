// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/raiseAirdrop.js": "私募空投" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const { getUserReferrer } = require("../models/referrer");
const { getBalanceLogInfo } = require("../models/balanceLog");
const { TSH_INCOME, TBG_MINE_POOL, TBG_TOKEN_COIN } = require("../common/constant/accountConstant.js");
const { insertSystemOpLog } = require("../models/systemOpLog");
const { updateSystemAmount, getOneAccount } = require("../models/systemPool");
const { getAssetsInfoById } = require("../models/asset");
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { insertBalanceLog } = require("../models/balance");
const { updateTbgBalance } = require("../models/tbgBalance");
const TRADE_CONSTANTS = require("../common/constant/tradeConstant.js");


/**
 * 私募空投
 * @param { String } accountName 用户的帐号
 * @param { number } apId 资产包 id 
 * @param { string } memo 备注
 */
async function raiseAirdrop(accountName, apId, memo) {
    try {
        // 获取用户私募的资产信息
        const assetsInfo = await getAssetsInfoById([apId]);
        const amount = new Decimal(assetsInfo[0].amount);
        const quantity = amount.mul(assetsInfo[0].release_multiple);
        const signatureProvider = new JsSignatureProvider([ PRIVATE_KEY_TEST ]);
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        // 系统第一个账户没有推荐人，多出的部分转到股东池账户
        let rows = await getOneAccount(TSH_INCOME);
        if (!rows) {
            logger.debug(`system account ${ TSH_INCOME } not found`);
            throw Error(`system account ${ TSH_INCOME } not found`);
        }
        const now = new Date();
        let userReferrer = await getUserReferrer(accountName);
        const reBalanceLogInfo = await getBalanceLogInfo({ accountName: userReferrer, opType: OPT_CONSTANTS.RAISE });
        const referrerIncome = quantity.mul(TBG_ALLOCATE.RAISE_REFERRER_AIRDROP).div(TBG_ALLOCATE.BASE_RATE);
        const reCurrentBalance = new Decimal(reBalanceLogInfo[0].current_balance).add(referrerIncome);
        const reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, referrer ${ userReferrer } get airdrop ${ referrerIncome }`;
        const current = amount.mul(assetsInfo[0].mining_multiple).add(rows.pool_amount).toNumber();
        const destroyAmount = amount.mul(TRADE_CONSTANTS.DESTROY);
        const miningAmount = amount.mul(assetsInfo[0].mining_multiple);
        // @ts-ignore
        // 区块链事务执行
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        let actions = {
            actions: [
                {
                    account: TBG_TOKEN_COIN,
                    name: "transfer",
                    authorization: [{
                        actor: TBG_TOKEN_COIN,
                        permission: 'active',
                    }],
                    data: {
                        from: TBG_TOKEN_COIN,
                        to: accountName,
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
                    name: "transfer",
                    authorization: [{
                        actor: TBG_TOKEN_COIN,
                        permission: 'active',
                    }],
                    data: {
                        from: TBG_TOKEN_COIN,
                        to: '推荐人',
                        quantity: `${ referrerIncome.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: reBalanceRemark,
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
                        quantity: `${ destroyAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, destroy ${ destroyAmount.toFixed(4) }`,
                    }
                }
            ]
        }

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            // 按私募数量的 5 倍释放，直接转入私募的账户
            await updateTbgBalance(client, accountName, quantity.toNumber(), 0, 0);
            await insertBalanceLog(client, accountName, quantity, current, OPT_CONSTANTS.RAISE, {}, memo, now);

            // 按私募数量的 3 倍 TBG 由发币账号转入矿池账号
            await insertSystemOpLog(client, miningAmount.toNumber(), current, {}, OPT_CONSTANTS.MINING, memo, now);
            await updateSystemAmount(client, TBG_MINE_POOL,  miningAmount, current);

            // 0.1 倍推荐奖励给推荐人
            await updateTbgBalance(client, userReferrer, referrerIncome.toNumber(), 0, 0);
            await insertBalanceLog(client, userReferrer, referrerIncome, reCurrentBalance, OPT_CONSTANTS.RAISE, {}, reBalanceRemark, now);

            // 0.0061 倍销毁
            await insertSystemOpLog(client, destroyAmount.toNumber(), current, {}, OPT_CONSTANTS.DESTROY, memo, now);
            await updateSystemAmount(client, TSH_INCOME, destroyAmount.toNumber(), current);
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

module.exports = raiseAirdrop