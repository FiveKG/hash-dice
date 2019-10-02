// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "挖矿" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const ACCOUNT_CONSTANT = require("../common/constant/accountConstant.js");
const { getUserReferrer } = require("../models/referrer");
const { TSH_INCOME, TBG_MINE_POOL, TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { updateTbgBalance, getTbgBalanceInfo } = require("../models/tbgBalance");
const { getAllParentLevel, getGlobalAccount } = require("../models/account");
const { format } = require("date-fns");
const { scheduleJob } = require("node-schedule");

logger.debug(`releaseAssets running...`);
// 每天 0：00 释放
scheduleJob("0 0 0 */1 * *", mining);
// mining()

/**
 * 挖矿
 * 每日0点统计将用户收取的挖矿数量从矿池账号转至释放池账号
 */
async function mining() {
    try {
        // 查找所有用户的 TBG 资产
        const trxList = [];
        const tmpActions = [];
        const now = format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
        logger.debug("now: ", now);
        const opType = OPT_CONSTANTS.MINING;
        let sql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra, remark, create_time)
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
        // 获取这一天所有的收取过挖矿的记录
        const getBalanceLogSql = `SELECT * FROM balance_log WHERE extra ->> 'symbol' = $1 AND op_type = $2 AND create_time BETWEEN CAST($3 AS DATE) - 1 AND $3`
        let { rows: balanceLogInfo } = await pool.query(getBalanceLogSql, [ TBG_TOKEN_SYMBOL, opType, now]);

        if (balanceLogInfo.length === 0) {
            return;
        }
        
        // 遍历所有的记录
        for (const info of balanceLogInfo) {
            // 查找用户的推荐关系，再从中找出全球合伙人
            const accountName = info.account_name;
            const amount = new Decimal(info.change_amount);
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
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ opType }, surplus assets airdrop ${ amount.mul(0.005) } to ${ userReferrer }`;
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
                            memo: `user ${ accountName } at ${ now } ${ opType}, airdrop ${ amount.mul(0.01) } to global account  ${ userReferrer }`,
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
                const reBalanceRemark = `user ${ accountName } at ${ now } ${ opType }, airdrop ${ amount.mul(0.005) } to global account referrer ${ userReferrer } `;
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
                            memo: `user ${ accountName } at ${ now } ${ opType }, airdrop ${ amount.mul(0.01) } to global account  ${ userReferrer }`,
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

                const opts = [ accountName, amount.mul(0.005), amount.mul(0.005).add(tbgBalance.release_amount), OPT_CONSTANTS.MINING_REFERRER, { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE }, reBalanceRemark, now ]

                trxList.push({
                    sql: sql,
                    values: opts
                });

                trxList.push({
                    sql: updateBalanceSql,
                    values: [ amount.mul(0.005), 0, 0, accountName ]
                });
            }

            // 挖矿收益转到 TBG_FREE_POOL 帐号
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
                    quantity: `${ amount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: `${ now } check in airdrop`
                }
            })
        }

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        // 发送区块链转帐消息
        await psTrx.pub(tmpActions);
    } catch (err) {
        logger.error("mining error, the error stock is %O", err);
        throw err;
    }
}

module.exports = mining