// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "处理游戏分配过来的收益" });
const { Decimal } = require("decimal.js");
const { getAllTrade } = require("../models/trade");
const { format } = require("date-fns");
const GAME_CONSTANTS = require("../common/constant/gameConstants")
const { getSystemAccountInfo } = require("../models/systemPool");
const { SHAREHOLDERS_POOL, SAFE_POOL, TSH_INCOME, TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { UE_TOKEN_SYMBOL, TBG_TOKEN_SYMBOL, UE_TOKEN } = require("../common/constant/eosConstants.js");
const { getUserReferrer } = require("../models/referrer");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const { getTbgBalanceInfo } = require("../models/tbgBalance");
const { getAllParentLevel, getGlobalAccount } = require("../models/account");
const ACCOUNT_CONSTANT = require("../common/constant/accountConstant.js");
const { allocateSurplusAssets } = require("../businessLogic/systemPool");
const { setRate } = require("./util");
const storeIncome = require("../common/storeIncome.js");

/**
 * 处理游戏分配过来的收益
 * "globallotto", "treasure", "luckyhongbao", "hashdice", "minlottery"
 * @param {{ "account_name": string, "game_name": string, "game_amount": number, "amount": number }} data
 */
async function handlerGameReceiver(data) {
    try {
        /**
         * 1. 用户玩游戏，获得游戏空投
         * 2. 用户的推荐人获得相应的奖励
         * 3. 按比例分配用户的投注额度
         */
        const sqlList = [];
        const actList = [];
        const { toProtectionPool, toReferrer, toTshIncome, toTshPool } = culBonus(data);

        // 获取系统账户
        const systemAccount = await getSystemAccountInfo();
        const holderAccount = systemAccount.find(item => item.pool_type === SHAREHOLDERS_POOL && item.pool_symbol === UE_TOKEN_SYMBOL);
        const proAccount = systemAccount.find(item => item.pool_type === SAFE_POOL  && item.pool_symbol === UE_TOKEN_SYMBOL);
        const tshAccount = systemAccount.find(item => item.pool_type === TSH_INCOME && item.pool_symbol === UE_TOKEN_SYMBOL);
        if (!holderAccount) {
            logger.debug(`system account ${ SAFE_POOL } not found`);
            throw new Error(`system account ${ SAFE_POOL } not found`);
        }
        if (!proAccount) {
            logger.debug(`system account ${ SAFE_POOL } not found`);
            throw new Error(`system account ${ SAFE_POOL } not found`);
        }
        if (!tshAccount) {
            logger.debug(`system account ${ TSH_INCOME } not found`);
            throw new Error(`system account ${ TSH_INCOME } not found`);
        }

        const insertSysOpLogSql = `
            insert into 
                system_op_log(change_amount, current_balance, extra, op_type, remark, create_time)
                values($1, $2, $3, $4, $5, $6);
        `
        const upSysPoolSql = `update system_pools set pool_amount = $1 where pool_type = $2 AND pool_symbol = $3;`
        const tmpSysAcc = [ 
            { sysInfo: holderAccount, income: toTshPool },
            { sysInfo: proAccount, income: toProtectionPool },
            { sysInfo: tshAccount, income: toTshIncome } 
        ];
        // 分配给股东，三倍收益保障池，tsh 帐号
        for (const info of tmpSysAcc) {
            const poolAmount = new Decimal(info.sysInfo.pool_amount);
            const remark = `user play ${ data.game_name }, ${ info.sysInfo.pool_type } balance add ${ info.income }`;
            const extra = { "symbol": UE_TOKEN_SYMBOL, aid: info.sysInfo.pool_type }
            sqlList.push({
                sql: insertSysOpLogSql,
                values: [ 
                    poolAmount.add(info.income).toNumber(), poolAmount.toNumber(), extra, 
                    'game', remark, format(new Date(), "YYYY-MM-DD HH:mm:sssssZ") 
                ]
            });
            sqlList.push({ sql: upSysPoolSql, values: [ poolAmount.add(info.income).toNumber(), info.sysInfo.pool_type, UE_TOKEN_SYMBOL ]})
        }

        // 拨入游戏的 2% 分配给全球合伙人和全球合伙人的推荐人， 全球合伙人 75%， 全球合伙人推荐人 25%
        const toGlobalPartner = toReferrer.mul(0.2).mul(0.75);
        const toGlobalPartnerReferrer = toReferrer.mul(0.2).mul(0.25);
        const accountName = data.account_name
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
        const now = format(new Date(), "YYYY-MM-DD HH:mm:sssssZ");
        const memoPrefix = `user ${ accountName } at ${ now } play ${ data.game_name } ${ OPT_CONSTANTS.GAME }`
        let memoStr = ``
        // 系统第一个账户没有推荐人，多出的部分转到股东池账户
        if (!userReferrer) {
            userReferrer = TSH_INCOME;
            memoStr = `${ memoPrefix }, allocating ${ toGlobalPartnerReferrer } to ${ TSH_INCOME }`
        } else {
            memoStr = `${ memoPrefix }, ${ globalAccount }'s referrer ${ userReferrer } get ${ toGlobalPartnerReferrer.toFixed(4) }`;
        }

        let toGlobalData = {
            "account_name": globalAccount,
            "change_amount": toGlobalPartner,
            "create_time": format(now, "YYYY-MM-DD HH:mm:ssZ"),
            "op_type": OPT_CONSTANTS.GAME_INVITE,
            "extra": { "symbol": UE_TOKEN_SYMBOL },
            "remark": `${ memoPrefix }, global partner get ${ toGlobalPartnerReferrer.toFixed(4) }`
        }
        // 存入 redis，待用户点击的时候再收取
        await storeIncome(globalAccount, OPT_CONSTANTS.GAME_INVITE, toGlobalData);

        let toGlobalReferrerData = {
            "account_name": userReferrer,
            "change_amount": toGlobalPartnerReferrer,
            "create_time": format(now, "YYYY-MM-DD HH:mm:ssZ"),
            "op_type": OPT_CONSTANTS.GAME_INVITE,
            "extra": { "symbol": UE_TOKEN_SYMBOL },
            "remark": `${ memoStr }`
        }
        // 存入 redis，待用户点击的时候再收取
        await storeIncome(userReferrer, OPT_CONSTANTS.GAME_INVITE, toGlobalReferrerData);

        // 用户参加游戏空投 1 ： 0.05
        const tbgBalance = await getTbgBalanceInfo(data.account_name);
        const airdropAmount = new Decimal(data.game_amount).mul(0.05);
        actList.push({
            account: TBG_TOKEN_COIN,
            name: "transfer",
            authorization: [{
                actor: TBG_TOKEN_COIN,
                permission: 'active',
            }],
            data: {
                from: TBG_TOKEN_COIN,
                to: data.account_name,
                quantity: `${ airdropAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                memo: `${ memoPrefix }, airdrop ${ airdropAmount.toFixed(4) }`,
            }
        })

        let balanceLogSql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra, remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        // 更新用户可售余额
        const updateBalanceSql = `
            UPDATE tbg_balance 
                SET release_amount = release_amount + $1, 
                    sell_amount = sell_amount + $2,  
                    active_amount = active_amount + $3
                WHERE account_name = $4
        `
        const opts = [ 
            accountName, airdropAmount, airdropAmount.add(tbgBalance.release_amount), OPT_CONSTANTS.GAME, 
            { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE }, `${ memoPrefix }, airdrop ${ airdropAmount.toFixed(4) }`, now 
        ]

        // 记录 balance 日志
        sqlList.push({ sql: balanceLogSql, values: opts});

        // 更新用户的释放池余额
        sqlList.push({ sql: updateBalanceSql, values: [ airdropAmount, 0, 0, accountName ] });

        // 拨入游戏的 98% 分配按用户的层级分配
        // 第一层：50%、第二层：25%、第三层：1%、第四层：1.5%、第五层：2、第六层：2.5%、第七层：3%、第八层：5%、第九层： 10%
        let count = 1;
        let distributed = new Decimal(0);
        const selectGameAmount = `
            SELECT sum(change_amount) 
                FROM balance_log 
                WHERE extract(month FROM create_time) = extract(month FROM now())
                AND account_name = $1
                AND op_type = $2
        `;
        const levelBonus = toReferrer.mul(0.98)
        for (const referrer of referrerAccountList) {
            if (referrer === '' || referrer === accountName) {
                continue;
            }
            const rate = setRate(count);
            const income = levelBonus.mul(rate);
            const { rows: [ { sum } ] } = await pool.query(selectGameAmount, [ referrer, OPT_CONSTANTS.GAME ]);
            // 每投注 10 UE，则可享有1层的推荐奖励，以此类推，投注 90 UE 以上，可享有 9 层推荐奖励每月初开始实时计算，实时升级，月终归零
            if (!!sum && !new Decimal(sum).lessThan(count * 10)) {
                distributed.add(income);
                // 增加推荐人的 amount
                let now = new Date();
                let data = {
                    "account_name": referrer,
                    "change_amount": income,
                    "create_time": format(now, "YYYY-MM-DD HH:mm:ssZ"),
                    "op_type": OPT_CONSTANTS.GAME_INVITE,
                    "extra": { "symbol": UE_TOKEN_SYMBOL },
                    "remark": `${ memoPrefix }, `
                }
                // 存入 redis，待用户点击的时候再收取
                await storeIncome(referrer, OPT_CONSTANTS.GAME_INVITE, data);
            }
            
            // 只分配九层
            if (count >= 9) {
                break;
            } else {
                count++;
            }
        }

        // 分配剩余的收益
        if (!levelBonus.div(distributed).lessThanOrEqualTo(0)) {
            await allocateSurplusAssets(pool, systemAccount, levelBonus, distributed, OPT_CONSTANTS.GAME_INVITE);
        }
        
        // logger.debug("sqlList: ", sqlList);
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        // 一笔交易完成，才对用户执行空投及相关的转账操作
        if (actList.length !== 0) {
            await psTrx.pub(actList);
        }
    } catch (err) {
        logger.error("sell assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = handlerGameReceiver

/**
 * 计算奖金
 * @param {{ game_name: string, amount: number }} data 
 */
function culBonus(data) {
    const amount = new Decimal(data.amount);
    const baseRate = GAME_CONSTANTS.BASE_RATE;
    let toTshPool = null;
    let toProtectionPool = null;
    let toReferrer = null;
    let toTshIncome = null;
    if (data.game_name === "globallotto") {
        // 1% 拨入 TBG 股东分红池
        toTshPool = amount.mul(GAME_CONSTANTS.GLOBAL_LOTTO_ALLOC_TO_TSH_POOL).div(baseRate);
        // 1% 拨入 TBG 三倍收益保障池
        toProtectionPool = amount.mul(GAME_CONSTANTS.GLOBAL_LOTTO_ALLOC_TO_PROTECTION_POOL).div(baseRate);
        // 5% 拨入 TBG 共享推荐佣金分配；
        toReferrer = amount.mul(GAME_CONSTANTS.GLOBAL_LOTTO_ALLOC_TO_REFERRER).div(baseRate);
        // 1.5% TSH投资股东收益
        toTshIncome = amount.mul(GAME_CONSTANTS.GLOBAL_LOTTO_ALLOC_TO_TSH_INCOME).div(baseRate);
    } else if (data.game_name === "luckyhongbao") {
        // 拨入 TBG 股东分红池
        toTshPool = amount.mul(GAME_CONSTANTS.HONG_BAO_ALLOC_TO_TSH_POOL).div(baseRate);
        logger.debug(`toTshPool:`, toTshPool);
        // 拨入 TBG 三倍收益保障池
        toProtectionPool = amount.mul(GAME_CONSTANTS.HONG_BAO_ALLOC_TO_PROTECTION_POOL).div(baseRate);
        logger.debug(`toProtectionPool:`, toProtectionPool);
        // 拨入 TBG 共享推荐佣金分配；
        toReferrer = amount.mul(GAME_CONSTANTS.HONG_BAO_ALLOC_TO_REFERRER).div(baseRate);
        logger.debug(`toReferrer:`, toReferrer);
        // TSH投资股东收益
        toTshIncome = amount.mul(GAME_CONSTANTS.HONG_BAO_ALLOC_TO_TSH_INCOME).div(baseRate);
        logger.debug(`toTshIncome:`, toTshIncome);
    } else if (data.game_name === "treasure") {
        // 1% 拨入 TBG 股东分红池
        toTshPool = amount.mul(GAME_CONSTANTS.TREASURE_ALLOC_TO_TSH_POOL).div(baseRate);
        // 1% 拨入 TBG 三倍收益保障池
        toProtectionPool = amount.mul(GAME_CONSTANTS.TREASURE_ALLOC_TO_PROTECTION_POOL).div(baseRate);
        // 3% 拨入 TBG 共享推荐佣金分配；
        toReferrer = amount.mul(GAME_CONSTANTS.TREASURE_ALLOC_TO_REFERRER).div(baseRate);
        // 1.5% TSH投资股东收益
        toTshIncome = amount.mul(GAME_CONSTANTS.TREASURE_ALLOC_TO_TSH_INCOME).div(baseRate);
    } else if (data.game_name === "hashdice") {
        // 0.1% 拨入 TBG 股东分红池
        toTshPool = amount.mul(GAME_CONSTANTS.HASH_DICE_ALLOC_TO_TSH_POOL).div(baseRate);
        // 0.1% 拨入 TBG 三倍收益保障池
        toProtectionPool = amount.mul(GAME_CONSTANTS.HASH_DICE_ALLOC_TO_PROTECTION_POOL).div(baseRate);
        // 0.3% 拨入 TBG 共享推荐佣金分配；
        toReferrer = amount.mul(GAME_CONSTANTS.HASH_DICE_ALLOC_TO_REFERRER).div(baseRate);
        // 0.3% TSH投资股东收益
        toTshIncome = amount.mul(GAME_CONSTANTS.HASH_DICE_ALLOC_TO_TSH_INCOME).div(baseRate);
    } else if (data.game_name === "minlottery") {
        // 0.1% 拨入 TBG 股东分红池
        toTshPool = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_TSH_POOL).div(baseRate);
        // 0.1% 拨入 TBG 三倍收益保障池
        toProtectionPool = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_PROTECTION_POOL).div(baseRate);
        // 0.3% 拨入 TBG 共享推荐佣金分配；
        toReferrer = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_REFERRER).div(baseRate);
        // 0.3% TSH投资股东收益
        toTshIncome = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_TSH_INCOME).div(baseRate);
    } else {
        // 0.1% 拨入 TBG 股东分红池
        toTshPool = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_TSH_POOL).div(baseRate);
        // 0.1% 拨入 TBG 三倍收益保障池
        toProtectionPool = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_PROTECTION_POOL).div(baseRate);
        // 0.3% 拨入 TBG 共享推荐佣金分配；
        toReferrer = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_REFERRER).div(baseRate);
        // 0.3% TSH投资股东收益
        toTshIncome = amount.mul(GAME_CONSTANTS.MIN_LOTTERY_ALLOC_TO_TSH_INCOME).div(baseRate);
    }

    return {
        toTshPool,
        toProtectionPool,
        toReferrer,
        toTshIncome
    }
}