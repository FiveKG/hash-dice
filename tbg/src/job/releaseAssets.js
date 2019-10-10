// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "线性释放" });
const { MEMBER_LEVEL_TRX } = require("../common/constant/assetsConstant.js");
const { Decimal } = require("decimal.js");
const { userMember } = require("../common/userMember.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const { ACCOUNT_INACTIVATED, ACCOUNT_ACTIVATED_TBG_1, TSH_INCOME, ACCOUNT_TYPE } = require("../common/constant/accountConstant");
const { pool, psTrx } = require("../db");
const { scheduleJob } = require("node-schedule");
const { TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const df = require("date-fns");
const { getCurrencyStats } = require("./getTrxAction.js");

/**
 * 所有进入释放池的TBG，从次日 0:00 开始释放
 * 从用户的释放池减去，增加到可用余额
 */
async function releaseAssets() {
    try {
        let selectAccountLevelSql = `
            SELECT (SELECT count(1) as count FROM referrer r
                        JOIN account a ON r.account_name = a.account_name
                        AND a.state != ${ ACCOUNT_INACTIVATED }
                        AND a.state != ${ ACCOUNT_ACTIVATED_TBG_1 }
                    ) AS count, account_name, account_type
                FROM account
        `
        // 查找所有参与 tbg2 的用户
        let { rows: memberInfo } = await pool.query(selectAccountLevelSql);
        // 将用户信息存入 map 中
        const memberMap = new Map();
        for (const info of memberInfo) {
            memberMap.set(info.account_name, info);
        }
        
        // 查找所有用户的 TBG 资产
        const trxList = [];
        const releaseList = [];
        const { rows: tbgBalanceInfo } = await pool.query("SELECT * FROM tbg_balance where release_amount > 0");
        const now = df.format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
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
        // 遍历会员，根据等级释放
        for (const info of tbgBalanceInfo) {
            const accountInfo = memberMap.get(info.account_name);
            const levelInfo = userMember(accountInfo.count);
            // 当前会员等级的释放比例
            let releaseRate = MEMBER_LEVEL_TRX[levelInfo.ID].RELEASE_RATE;
            // 判断用户是不是全球合伙人
            // 是的话按照 全球合伙人 + 皇冠分配
            if (accountInfo.account_type === ACCOUNT_TYPE.GLOBAL && levelInfo.ID === "CROWN") {
                releaseRate = MEMBER_LEVEL_TRX["GLOBAL_PARTNER_CROWN"].RELEASE_RATE
            }
            // 释放池资产额度
            const releaseAmount = new Decimal(info.release_amount);
            // 可释放的额度
            const dayRelease = releaseAmount.mul(releaseRate);
            const remark = `user ${ info.account_name } at ${ now } release assets ${ dayRelease.toFixed(8) }, minus release_amount ${ dayRelease }`
            const opts = [ info.account_name, -dayRelease.toNumber(), releaseAmount.minus(dayRelease).toNumber(), OPT_CONSTANTS.RELEASE, { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE }, remark, now ]

            // 从用户的释放池减去
            trxList.push({
                sql: sql,
                values: opts
            });

            // 增加到可用余额
            const remark1 = `user ${ info.account_name } at ${ now } release assets ${ dayRelease.toFixed(8) }, add active_amount ${ dayRelease }`
            trxList.push({
                sql: sql,
                values: [ info.account_name, dayRelease.toNumber(), new Decimal(info.active_amount).add(dayRelease).toNumber(), OPT_CONSTANTS.RELEASE, { "symbol": TBG_TOKEN_SYMBOL, "op_type": 'active_amount' }, remark1, now ]
            });

            const updateOpts = [ -dayRelease.toNumber(), 0, dayRelease.toNumber(), info.account_name ]

            trxList.push({
                sql: updateBalanceSql,
                values: updateOpts
            });

            releaseList.push({ account_name: info.account_name, release_amount: dayRelease.toNumber() })
        }

        // TBG区块链实验室 第 3 个月开始 5 年线性释放
        // TBG社区基金 第 3 个月开始 5 年线性释放
        const selectReleaseTime = `SELECT create_time FROM balance_log WHERE op_type = '$1' ORDER BY create_time ASC LIMIT 1;`
        const { rows: [ releaseTime ] } = await pool.query(selectReleaseTime, [ OPT_CONSTANTS.RELEASE ]);
        const actList = [];
        // 如果已经开始释放，判断第一次释放到当前的时间间隔是否为三个月
        if (!!releaseTime)  {
            if (df.differenceInMonths(new Date(), releaseTime) >= 3) {
                // 释放天数
                // 先获取 TBG 发行总量
                const { [TBG_TOKEN_SYMBOL]: { max_supply, supply } } = await getCurrencyStats(TBG_TOKEN_COIN, TBG_TOKEN_SYMBOL);
                // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
                const maxSupply = new Decimal(max_supply.split(" ")[0]);
                const dayCounts = df.differenceInDays(df.addYears(new Date(), 3), new Date());
                // 每天 tbg 基金的释放额度
                const fundCurrency = new Decimal(TBG_ALLOCATE.FUND_CURRENCY).div(TBG_ALLOCATE.BASE_RATE).mul(maxSupply).div(dayCounts);
                // 每天团队的释放额度
                const laboratoryCurrency = new Decimal(TBG_ALLOCATE.LABORATORY_CURRENCY).div(TBG_ALLOCATE.BASE_RATE).mul(maxSupply).div(dayCounts);
                // const tsh = {
                //     account: TBG_TOKEN_COIN,
                //     name: "transfer",
                //     authorization: [{
                //         actor: TBG_TOKEN_COIN,
                //         permission: 'active',
                //     }],
                //     data: {
                //         from: TBG_FREE_POOL,
                //         to: TSH_INCOME,
                //         quantity: `${ laboratoryCurrency.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                //         memo: `${ now } release asset to tsh`
                //     }
                // }

                actList.push({
                    account: TBG_TOKEN_COIN,
                    name: "transfer",
                    authorization: [{
                        actor: TBG_TOKEN_COIN,
                        permission: 'active',
                    }],
                    data: {
                        from: TBG_FREE_POOL,
                        to: TSH_INCOME,
                        quantity: `${ fundCurrency.add(laboratoryCurrency).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: `${ now } release asset to team and tsh`
                    }
                })
            }
        }  

        // 此处可以直接转给用户，智能合约已经设置为用户不可私下交易，只能通过平台转出
        const actionList = releaseList.map(it => {
            return {
                account: TBG_TOKEN_COIN,
                name: "transfer",
                authorization: [{
                    actor: TBG_TOKEN_COIN,
                    permission: 'active',
                }],
                data: {
                    from: TBG_FREE_POOL,
                    to: it.account_name,
                    quantity: `${ new Decimal(it.release_amount).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: `${ now } release asset`
                }
            }
        });

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
        await psTrx.pub(actionList);
    } catch (err) {
        logger.error("release assets error, the error stock is %O", err);
        throw err;
    }
}

logger.debug(`releaseAssets running...`);
// 每天 0：00 释放
scheduleJob("0 0 0 */1 * *", releaseAssets);
// releaseAssets()

module.exports = releaseAssets;
