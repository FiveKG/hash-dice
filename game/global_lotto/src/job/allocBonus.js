// @ts-check
const logger = require("../common/logger.js");
const { Decimal } = require("decimal.js");
const { xhr } = require("../common");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { UE_TOKEN_SYMBOL } = require("../common/constant/eosConstants");
const { redis, generate_primary_key } = require("../common");
const url = require("url");

/**
 * 分配奖金
 * @param { any } prize_pool 奖池
 * @param { number } winCount 中奖号码个数数
 * @param { any[] } bonusAccList 中奖列表
 * @param { string } winType 中奖类型
 * @param { number | string } awardRate 分配比例
 * @param { string } insertRewardSql
 */
async function allocBonus(prize_pool, winCount, bonusAccList, winType, awardRate, insertRewardSql) {
    const sqlList = [];
    // 存放 区块链转账
    const actList = [];
    
    // 发放的金额
    let issued = new Decimal(0);
    const prizePool = new Decimal(prize_pool);
    const len = bonusAccList.length;
    // 五、六、七等奖奖金为固定额度
    if (winCount <= ALLOC_CONSTANTS.FIFTH_PRICE_COUNT) {
        if (len !== 0) {
            // 一个 key 可得的奖金
            const oneKeyBonus = new Decimal(awardRate).toFixed(4);
            for (const info of bonusAccList) {
                const extra = {
                    ...info.extra,
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
            // 一个 key 可得的奖金
            const oneKeyBonus = totalBonus.div(len);
            for (const info of bonusAccList) {
                const extra = {
                    ...info.extra,
                };
                const opts = [
                    generate_primary_key(), info.gs_id, extra, info.account_name, "now()", info.bet_num,
                    winCount, winType, oneKeyBonus.toFixed(4), oneKeyBonus.toFixed(4)
                 ]

                const balanceInfo = {
                    "account_name": accountName,
                    "release_amount": bindAirdrop,
                    "sell_amount": 0,
                    "active_amount": 0,
                    "current_balance": acCurrentBalance,
                    "op_type": bindId,
                    "extra": { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE },
                    "remark": acBalanceRemark,
                }
                
                sqlList.push({ sql: insertRewardSql, values: opts });
                issued = issued.add(oneKeyBonus);
                // 开出超级大奖后，推荐人可得 10%，从奖池中扣除
                if (winType === "lottery_award") {
                    const bonus = oneKeyBonus.mul(ALLOC_CONSTANTS.SPECIAL_AWARD).div(ALLOC_CONSTANTS.BASE_RATE);
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
                    }
                }
            }
        } 
    }

    return { issued, sqlList };
}

module.exports = allocBonus;