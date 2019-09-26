// @ts-check
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "分配奖金，买中的奖金全部转入区块链帐号中" });
const { Decimal } = require("decimal.js");
const { xhr } = require("../common");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { UE_TOKEN_SYMBOL, BANKER, GLOBAL_LOTTO_CONTRACT, UE_TOKEN, GLOBAL_LOTTO_RESERVE_ACCOUNT } = require("../common/constant/eosConstants");
const { redis, generate_primary_key } = require("../common");
const url = require("url");

/**
 * 处理开奖信息
 * @param { DB.Game } gameInfo 
 * @param { Map<number, any> } rewardMap 
 */
async function handleOpenResult(gameInfo, rewardMap) {
    try {
        const sqlList = [];
        // 记录区块链相关调用信息
        const actList = [];
        const insertRewardSql = `
            INSERT INTO award_session (aw_id, gs_id, extra, account_name, create_time, bet_num, win_key, win_type, one_key_bonus, bonus_amount)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `
        // 派奖后奖池剩余
        let prizePoolSurplus = new Decimal(gameInfo.prize_pool);
        // 派奖后底池剩余
        let bottomPoolSurplus = new Decimal(gameInfo.bottom_pool);
        // 派奖后储备池剩余
        let reservePoolSurplus = new Decimal(gameInfo.reserve_pool);
        // 是否开出超级全球彩大奖
        let isLotteryAward = false;
        // 遍历用户中奖情况
        const bonusMap = new Map();
        for (const [ winCount, bonusAccList ] of rewardMap) {
            if (winCount === ALLOC_CONSTANTS.LOTTERY_AWARD_COUNT) {
                // 超级全球彩大奖
                const winType = "lottery_award"
                const { issued, sqlList: res, tmpActList } = await allocBonus(gameInfo.prize_pool, winCount, bonusAccList, winType, ALLOC_CONSTANTS.LOTTERY_AWARD, bonusMap);
                // 将全球彩底池的 50% 拨入下一轮全球彩奖池；
                if (res.length !== 0) {
                    isLotteryAward = true;
                    sqlList.push(...res);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    bottomPoolSurplus = bottomPoolSurplus.div(2);
                    actList.push(...tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.SECOND_PRICE_COUNT) {
                // 二等奖
                const winType = "second_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.SECOND_PRICE, bonusMap);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    actList.push(...tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.THIRD_PRICE_COUNT) {
                // 三等奖
                const winType = "third_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.THIRD_PRICE, bonusMap);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    actList.push(...tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.FOURTH_PRICE_COUNT) {
                // 四等奖
                const winType = "fourth_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.FOURTH_PRICE, bonusMap);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    prizePoolSurplus = prizePoolSurplus.minus(issued);
                    actList.push(...tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.FIFTH_PRICE_COUNT) {
                // 五等奖
                // 当五、六、七等奖奖金总额奖池不足以支付时，超出部分由全球彩储备池拨出；
                const winType = "fifth_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.FIFTH_PRICE, bonusMap, reservePoolSurplus);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    // const { pr, re } = await minusAllocAmount(prizePoolSurplus, issued, reservePoolSurplus);
                    // prizePoolSurplus = pr;
                    // reservePoolSurplus = re;
                    actList.push(...tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.SIXTH_PRICE_COUNT) {
                // 六等奖
                const winType = "sixth_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.SIXTH_PRICE, bonusMap, reservePoolSurplus);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    // const { pr, re } = await minusAllocAmount(prizePoolSurplus, issued, reservePoolSurplus);
                    // prizePoolSurplus = pr;
                    // reservePoolSurplus = re;
                    actList.push(...tmpActList);
                }
            } else if (winCount === ALLOC_CONSTANTS.SEVENTH_PRICE_COUNT) {
                // 七等奖
                const winType = "seventh_price"
                const { issued, sqlList: res, tmpActList } = await allocBonus(prizePoolSurplus, winCount, bonusAccList, winType, ALLOC_CONSTANTS.LOTTERY_AWARD, bonusMap, reservePoolSurplus);
                if (res.length !== 0) {
                    sqlList.push(...res);
                    // const { pr, re } = await minusAllocAmount(prizePoolSurplus, issued, reservePoolSurplus);
                    // prizePoolSurplus = pr;
                    // reservePoolSurplus = re;
                    actList.push(...tmpActList);
                }
            } else {
                // 未中奖的用户
                const winType = "sorry";
                if (bonusAccList.length !== 0) {
                    const oneKeyBonus = 0;
                    for (const info of bonusAccList) {
                        const extra = { ...info.extra }
                        const opts = [
                            generate_primary_key(), info.gs_id, extra, info.account_name, "now()", info.bet_num,
                            winCount, winType, oneKeyBonus, oneKeyBonus
                         ]
                        sqlList.push({ sql: insertRewardSql, values: opts });
                    }
                } 
            }
        }

        return {
            sqlList,
            actList,
            prizePoolSurplus,
            bottomPoolSurplus,
            reservePoolSurplus,
            isLotteryAward,
            bonusMap
        }
    } catch (err) {
        throw err;
    }
}

/**
 * 分配奖金，买中的奖金全部转入区块链帐号中
 * @param { any } prizePool 奖池
 * @param { number } winCount 中奖号码个数数
 * @param { any[] } bonusAccList 中奖列表
 * @param { string } winType 中奖类型
 * @param { number | string } awardRate 分配比例
 * @param { Map<string, any> } bonusMap
 * @param { any } [ reservePoolSurplus ]
 */
async function allocBonus(prizePool, winCount, bonusAccList, winType, awardRate, bonusMap, reservePoolSurplus) {
    const sqlList = [];
    // 存放 区块链转账
    const tmpActList = [];
    const insertRewardSql = `
        INSERT INTO award_session (aw_id, gs_id, extra, account_name, create_time, bet_num, win_key, win_type, one_key_bonus, bonus_amount)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    // 发放的金额
    let issued = new Decimal(0);
    // const prizePool = new Decimal(prize_pool);
    const len = bonusAccList.length;
    
    // 五、六、七等奖奖金为固定额度
    if (winCount <= ALLOC_CONSTANTS.FIFTH_PRICE_COUNT) {
        if (len !== 0) {
            // 一个 key 可得的奖金
            const oneKeyBonus = new Decimal(awardRate).toFixed(4);
            prizePool = prizePool.minus(oneKeyBonus);
            for (const info of bonusAccList) {
                let bonus = new Decimal(oneKeyBonus);
                let returnsCurrency = new Decimal(0);
                const payType = info.extra.pay_type;
                let memo = `user ${ info.account_name } bingo ${ winCount } number, get ${ bonus } ${ UE_TOKEN_SYMBOL } bonus`;
                if (payType !== UE_TOKEN_SYMBOL) {
                    // 如果用户使用游戏码或者可提现余额投注,投注金额需返回用户的账户中,奖金为 总的金额 - 退还额度
                    returnsCurrency = new Decimal(info.extra.bet_amount);
                    bonus = new Decimal(oneKeyBonus).minus(returnsCurrency);
                    const acc = bonusMap.get(info.account_name);
                    if (!acc) {
                        bonusMap.set(info.account_name, { change_amount: returnsCurrency, pay_type: payType });
                        memo = `user ${ info.account_name } bingo ${ winCount } number, return ${ payType } ${ returnsCurrency } after get ${ bonus } ${ UE_TOKEN_SYMBOL } bonus`
                    }
                }
                
                // 如果奖池不够支付，那么使用
                let from = BANKER;
                if (prizePool.lessThan(0)) {
                    // 检查储备池是否足够支付
                    if (!reservePoolSurplus.lessThan(oneKeyBonus)) {
                        // 算出差额
                        const diff = issued.minus(prizePool);
                        // 发放完底池
                        prizePool = prizePool.minus(prizePool);
                        // 从储备池减去差额
                        reservePoolSurplus = reservePoolSurplus.minus(diff);
                    } else {
                        // todo
                        // 余额不足
                        prizePool = prizePool.minus(prizePool);
                        reservePoolSurplus = reservePoolSurplus.minus(reservePoolSurplus);
                    }
                } else {
                    from = GLOBAL_LOTTO_RESERVE_ACCOUNT;
                }
                tmpActList.push({
                    account: UE_TOKEN,
                    name: "transfer",
                    authorization: [{
                        actor: from,
                        permission: 'active',
                    }],
                    data: {
                        from: from,
                        to: info.account_name,
                        quantity: `${ bonus } ${ UE_TOKEN_SYMBOL }`,
                        memo: memo,
                    }
                });

                const extra = {
                    ...info.extra,
                    award_rate: awardRate,
                    memo: memo
                }
                const opts = [
                    generate_primary_key(), info.gs_id, extra, info.account_name, "now()", info.bet_num,
                    winCount, winType, oneKeyBonus, oneKeyBonus
                 ]
                sqlList.push({ sql: insertRewardSql, values: opts });
                issued = issued.add(oneKeyBonus);
            }
        } 
    } else {
        if (len !== 0) {
            // 总的奖金
            const totalBonus = prizePool.mul(awardRate).div(ALLOC_CONSTANTS.BASE_RATE);
            prizePool = prizePool.minus(totalBonus);
            // 一个 key 可得的奖金
            const oneKeyBonus = totalBonus.div(len);
            for (const info of bonusAccList) {
                let bonus = new Decimal(oneKeyBonus);
                let returnsCurrency = new Decimal(0);
                const payType = info.extra.pay_type;
                let memo = `user ${ info.account_name } bingo ${ winCount } number, get ${ oneKeyBonus.toFixed(4) } ${ UE_TOKEN_SYMBOL } bonus`
                if (payType !== UE_TOKEN_SYMBOL) {
                    // 如果用户使用游戏码或者可提现余额投注,投注金额需返回用户的账户中,奖金为 总的金额 - 退还额度
                    returnsCurrency = new Decimal(info.extra.bet_amount);
                    bonus = new Decimal(oneKeyBonus).minus(returnsCurrency);
                    const acc = bonusMap.get(info.account_name);
                    if (!acc) {
                        bonusMap.set(info.account_name, { change_amount: returnsCurrency, pay_type: payType });
                        memo = `user ${ info.account_name } bingo ${ winCount } number, return ${ payType } ${ returnsCurrency } after get ${ oneKeyBonus.toFixed(4) } ${ UE_TOKEN_SYMBOL } bonus`
                    }
                }
                // 奖金由庄家从区块链转到用户的账户
                tmpActList.push({
                    account: UE_TOKEN,
                    name: "transfer",
                    authorization: [{
                        actor: BANKER,
                        permission: 'active',
                    }],
                    data: {
                        from: BANKER,
                        to: info.account_name,
                        quantity: `${ bonus.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                        memo: memo,
                    }
                });

                const extra = {
                    ...info.extra,
                    award_rate: awardRate,
                    memo: memo
                };
                const opts = [
                    generate_primary_key(), info.gs_id, extra, info.account_name, "now()", info.bet_num,
                    winCount, winType, oneKeyBonus.toFixed(4), oneKeyBonus.toFixed(4)
                ]
                sqlList.push({ sql: insertRewardSql, values: opts });
                issued = issued.add(oneKeyBonus);
                // 开出超级大奖后，推荐人可得 10%，从奖池中扣除
                if (winType === "lottery_award") {
                    const bonus = oneKeyBonus.mul(ALLOC_CONSTANTS.SPECIAL_AWARD).div(ALLOC_CONSTANTS.BASE_RATE);
                    prizePool = prizePool.minus(bonus);
                    const extra = {
                        ...info.extra,
                    };
                    const TBG_SERVER = process.env.TBG_SERVER || "http://localhost:9527/";
                    const opts = { data: { account_name: info.account_name } };
                    const { data: { referrer_account } } = await xhr.get(url.resolve(TBG_SERVER, "/account/get_referrer"), opts);
                    if (!!referrer_account) {
                        // 推荐人获得特别奖
                        const opts = [
                            generate_primary_key(), info.gs_id, extra, referrer_account, "now()", info.bet_num,
                            winCount, "special_award", bonus.toFixed(4), bonus.toFixed(4)
                        ]
                        sqlList.push({ sql: insertRewardSql, values: opts });
                        issued = issued.add(bonus);

                        // 奖金由庄家从区块链转到用户的账户
                        tmpActList.push({
                            account: UE_TOKEN,
                            name: "transfer",
                            authorization: [{
                                actor: BANKER,
                                permission: 'active',
                            }],
                            data: {
                                from: BANKER,
                                to: info.account_name,
                                quantity: `${ oneKeyBonus.toFixed(4) } ${ UE_TOKEN_SYMBOL }`,
                                memo: `user ${ info.account_name } bingo ${ winCount } number, referrer get ${ bonus.toFixed(4) } ${ UE_TOKEN_SYMBOL } bonus`,
                            }
                        });
                    }
                }
            }
        } 
    }

    return { issued, sqlList, tmpActList, bonusMap };
}

module.exports = handleOpenResult;