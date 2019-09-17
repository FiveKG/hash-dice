// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "私募空投" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const ACCOUNT_CONSTANT = require("../common/constant/accountConstant.js");
const { getUserReferrer } = require("../models/referrer");
const { getAccountInfo, updateAccountState } = require("../models/account");
const { TSH_INCOME, TBG_MINE_POOL, TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { getAssetsInfoById } = require("../models/asset");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { insertBalanceLog } = require("../models/balance");
const { updateTbgBalance, getTbgBalanceInfo } = require("../models/tbgBalance");
const TRADE_CONSTANTS = require("../common/constant/tradeConstant.js");
const { generate_primary_key } = require("../common/index.js");
const { insertTradeLog, updateTrade, getTradeInfoHistory } = require("../models/trade");
const { format } = require("date-fns");

/**
 * 私募空投
 * @param {{ accountName: string, price: number }} data
 */
async function raiseAirdrop(data) {
    try {
        const updateTradeSql = `
            UPDATE trade SET state = $1, finished_time = $2, trx_amount = $3 WHERE id = $4
        `
        // 获取用户私募的资产信息
        const { accountName, price } = data;
        const tradeInfo = await getTradeInfoHistory({ "tradeType": OPT_CONSTANTS.RAISE, "accountName": accountName, orderBy: "ASC", state: "create" });
        // 如果找不到私募订单, 直接返回不做后续处理
        if (tradeInfo.length === 0) {
            return;
        }
        const trId = tradeInfo[0].id;
        const assetsInfo = await getAssetsInfoById([tradeInfo[0].extra.ap_id]);
        const amount = new Decimal(assetsInfo[0].amount);
        const quantity = amount.mul(assetsInfo[0].release_multiple);
        const now = format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
        const memo = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }`
        const tbgBalance = await getTbgBalanceInfo(accountName);
        const acCurrentBalance = new Decimal(tbgBalance.release_amount)
        // 查找推荐人
        let userReferrer = await getUserReferrer(accountName);
        let reCurrentBalance, reBalanceRemark;
        const referrerIncome = quantity.mul(TBG_ALLOCATE.RAISE_REFERRER_AIRDROP).div(TBG_ALLOCATE.BASE_RATE);
        let tmpActions = []
        reBalanceRemark = `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, referrer ${ userReferrer } get airdrop ${ referrerIncome }`;
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
                        quantity: `${ referrerIncome.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, allocating raise surplus assets airdrop to ${ TSH_INCOME }`,
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
                    memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, referrer ${ userReferrer } get airdrop ${ referrerIncome }`,
                }
            })
        }
        // 销毁的额度
        const destroyAmount = amount.mul(TRADE_CONSTANTS.DESTROY);
        // 私募可得 5 倍释放 + 0.61 倍销毁
        const acCurrent = quantity.add(acCurrentBalance).add(destroyAmount).toNumber();
        // 销毁后当前额度
        const afterDestroyBalance = quantity.add(acCurrentBalance).add(-destroyAmount);
        const miningAmount = amount.mul(assetsInfo[0].mining_multiple);
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
                        memo: `user ${ accountName } at ${ now } ${ OPT_CONSTANTS.RAISE }, transfer to mining ${ miningAmount }`,
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

        const accountInfo = await getAccountInfo(accountName);
        let accountState = ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_2;
        if (accountInfo.state === ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1) {
            accountState = ACCOUNT_CONSTANT.ACCOUNT_ACTIVATED_TBG_1_AND_2
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
                "op_type": OPT_CONSTANTS.RELEASE,
                "tr_id": trId,
                 ...assetsInfo[0]
            }
            await insertBalanceLog(client, accountName, quantity.add(destroyAmount).toNumber(), acCurrent, OPT_CONSTANTS.RAISE, extra, memo, 'now()');

            // 按私募数量的 5 倍释放，直接转入私募的账户, 同时销毁一部份
            await updateTbgBalance(client, accountName, destroyAmount.toNumber(), 0, 0);
            await insertBalanceLog(client, accountName, -destroyAmount.toNumber(), afterDestroyBalance.toNumber(), OPT_CONSTANTS.DESTROY, extra, memo, 'now()');

            // 0.1 倍推荐奖励给推荐人
            // 如果有推荐人，更新一下推荐人的释放池
            if (!!userReferrer) {
                await updateTbgBalance(client, userReferrer, referrerIncome.toNumber(), 0, 0);
                await insertBalanceLog(client, userReferrer, referrerIncome.toNumber(), reCurrentBalance.toNumber(), OPT_CONSTANTS.RAISE, { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE }, reBalanceRemark, 'now()');
            }
            const finishTime = format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
            const trLogId = generate_primary_key();
            const remark = `user ${ accountName } at ${ finishTime } done raise`;
            // 更新交易状态
            // await updateTrade(client, trId, "finished", finishTime);
            await client.query(updateTradeSql, [ "finished", finishTime, amount.toNumber(), trId ]);
            await insertTradeLog(client, trLogId, trId, OPT_CONSTANTS.RAISE, amount.toNumber(), remark, price, amount.mul(price).toNumber(), finishTime);
            // 更新用户状态
            await updateAccountState(client, accountState,accountName);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        // 发送区块链转帐消息
        await psTrx.pub(actions.actions);
    } catch (err) {
        logger.error("raise airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = raiseAirdrop