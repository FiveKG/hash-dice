// @ts-check

/***
 * 1. 80% 拨入全球彩奖池；
 * 2. 5% 拨入全球彩底池，当开出超级全球彩大奖的下一期，将全球彩底池的 50% 拨入下一轮全球彩奖池；
 * 3. 3% 拨入全球彩储备池，当五. 六. 七等奖,   奖金总额奖池不足以支付时，超出部分由全球彩储备池拨出；
 * 4. 2% 拨入 TBG 股东分红池；
 * 5. 2.5% 拨入 TBG 三倍收益保障池；
 * 6. 5% 拨入 TBG 共享推荐佣金分配；
 * 7. 2.5% 拨入团队，作资源购买及开发运维费用支配；
 * 
 * 1. 超级全球彩大奖 =（全球彩奖池 x 60% ) / 中奖数量
 * 2. 二等奖 =（全球彩奖池 x 10% ) / 中奖数量
 * 3. 三等奖 =（全球彩奖池 x 8% ) / 中奖数量
 * 4. 四等奖 =（全球彩奖池 x 5% ) / 中奖数量
 * 5. 五等奖 = 固定每注奖金 10 UE
 * 6. 六等奖 = 固定每注奖金 5 UE
 * 7. 七等奖 = 固定每注奖金 1 UE
 * 8. 全球彩特别奖 = 为被推荐者超级全球彩大奖奖金的10%
 */

const BASE_RATE = 100;

// 拨入全球彩奖池；
const ALLOC_TO_PRIZE_POOL = 80;
// 5% 拨入全球彩底池，当开出超级全球彩大奖的下一期，将全球彩底池的 50% 拨入下一轮全球彩奖池；
const ALLOC_TO_BOTTOM_POOL = 5;
// 3% 拨入全球彩储备池，当五. 六. 七等奖,   奖金总额奖池不足以支付时，超出部分由全球彩储备池拨出；
const ALLOC_TO_RESERVE_POOL = 3;

// 分发中心收益
const DISTRIBUTION_CENTER = 3.5;

// 拨入 TBG 钱包
const TBG_WALLET_RECEIVER = 8.5;

// 1% 拨入 TBG 股东分红池；
const ALLOC_TO_TSH_POOL = 2;
// 1% 拨入 TBG 三倍收益保障池；
const ALLOC_TO_PROTECTION_POOL = 2;
// 5% 拨入 TBG 共享推荐佣金分配；
const ALLOC_TO_REFERRER = 3;
// 1.5% TSH投资股东收益
const ALLOC_TO_TSH_INCOME = 1.5;

// 超级全球彩大奖
const LOTTERY_AWARD = 60;
// 按顺序中全部 9 个数字
const LOTTERY_AWARD_COUNT = 9;

// 二等奖
const SECOND_PRICE = 10;
// 按顺序中全部 8 个数字
const SECOND_PRICE_COUNT = 8;

// 三等奖
const THIRD_PRICE = 8;
// 按顺序中全部 7 个数字
const THIRD_PRICE_COUNT = 7;

// 四等奖
const FOURTH_PRICE = 5;
// 按顺序中全部 6 个数字
const FOURTH_PRICE_COUNT = 6;

// 特别奖
const SPECIAL_AWARD = 10;

// 五等奖
const FIFTH_PRICE = "10.0000";
// 按顺序中全部 5 个数字
const FIFTH_PRICE_COUNT = 5;

// 六等奖
const SIXTH_PRICE = "5.0000";
// 按顺序中全部 4 个数字
const SIXTH_PRICE_COUNT = 4;

// 七等奖
const SEVENTH_PRICE = "1.0000";
// 按顺序中全部 3 个数字
const SEVENTH_PRICE_COUNT = 3;

// 游戏每投注 1 UE, TBG空投 0.05 TBG
const GAME_AIRDROP_INCOME = 5;

// TBG 基金，作为长期社区建设、管理等费用，逐步释放
const FUND_CURRENCY = 5;
// TBG 区块链实验室，作为区块链技术研发费用，6年逐步释放
const LABORATORY_CURRENCY = 15;


/**
 * TBG发币规划
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "FUND_CURRENCY": FUND_CURRENCY,
    "LABORATORY_CURRENCY": LABORATORY_CURRENCY,
    "ALLOC_TO_PRIZE_POOL": ALLOC_TO_PRIZE_POOL,
    "ALLOC_TO_BOTTOM_POOL": ALLOC_TO_BOTTOM_POOL,
    "ALLOC_TO_RESERVE_POOL": ALLOC_TO_RESERVE_POOL,
    "ALLOC_TO_TSH_INCOME": ALLOC_TO_TSH_INCOME,
    "ALLOC_TO_PROTECTION_POOL": ALLOC_TO_PROTECTION_POOL,
    "ALLOC_TO_REFERRER": ALLOC_TO_REFERRER,
    "ALLOC_TO_TSH_POOL": ALLOC_TO_TSH_POOL,
    "DISTRIBUTION_CENTER": DISTRIBUTION_CENTER,
    "LOTTERY_AWARD": LOTTERY_AWARD,
    "SECOND_PRICE": SECOND_PRICE,
    "THIRD_PRICE": THIRD_PRICE,
    "FOURTH_PRICE": FOURTH_PRICE,
    "SPECIAL_AWARD": SPECIAL_AWARD,
    "FIFTH_PRICE": FIFTH_PRICE,
    "SIXTH_PRICE": SIXTH_PRICE,
    "SEVENTH_PRICE": SEVENTH_PRICE,
    "GAME_AIRDROP_INCOME": GAME_AIRDROP_INCOME,
    "LOTTERY_AWARD_COUNT": LOTTERY_AWARD_COUNT,
    "SECOND_PRICE_COUNT": SECOND_PRICE_COUNT,
    "THIRD_PRICE_COUNT": THIRD_PRICE_COUNT,
    "FOURTH_PRICE_COUNT": FOURTH_PRICE_COUNT,
    "FIFTH_PRICE_COUNT": FIFTH_PRICE_COUNT,
    "SIXTH_PRICE_COUNT": SIXTH_PRICE_COUNT,
    "SEVENTH_PRICE_COUNT": SEVENTH_PRICE_COUNT,
    "TBG_WALLET_RECEIVER": TBG_WALLET_RECEIVER
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } BASE_RATE 
 * @property { number } FUND_CURRENCY  TBG基金，作为长期社区建设、管理等费用，逐步释放
 * @property { number } LABORATORY_CURRENCY  TBG区块链实验室，作为区块链技术研发费用，6年逐步释放
 * @property { number } ALLOC_TO_PRIZE_POOL 拨入全球彩奖池；
 * @property { number } ALLOC_TO_BOTTOM_POOL 5% 拨入全球彩底池，当开出超级全球彩大奖的下一期，将全球彩底池的 50% 拨入下一轮全球彩奖池；
 * @property { number } ALLOC_TO_RESERVE_POOL 3% 拨入全球彩储备池，当五. 六. 七等奖,   奖金总额奖池不足以支付时，超出部分由全球彩储备池拨出；
 * @property { number } ALLOC_TO_TSH_POOL 1% 拨入 TBG 股东分红池；
 * @property { number } ALLOC_TO_PROTECTION_POOL 1% 拨入 TBG 三倍收益保障池；
 * @property { number } ALLOC_TO_REFERRER 5% 拨入 TBG 共享推荐佣金分配；
 * @property { number } DISTRIBUTION_CENTER 3.5% 分发中心收益
 * @property { number } ALLOC_TO_TSH_INCOME 1.5% TSH投资股东收益
 * @property { number } LOTTERY_AWARD 超级全球彩大奖
 * @property { number } SECOND_PRICE 二等奖
 * @property { number } THIRD_PRICE 三等奖
 * @property { number } FOURTH_PRICE 四等奖
 * @property { number } SPECIAL_AWARD 特别奖
 * @property { string } FIFTH_PRICE 五等奖
 * @property { string } SIXTH_PRICE 六等奖
 * @property { string } SEVENTH_PRICE 七等奖
 * @property { number } GAME_AIRDROP_INCOME 游戏每投注 1 UE, TBG空投 0.05 TBG
 * @property { number } LOTTERY_AWARD_COUNT 按顺序中全部 9 个数字
 * @property { number } SECOND_PRICE_COUNT 按顺序中全部 8 个数字
 * @property { number } THIRD_PRICE_COUNT 按顺序中全部 7 个数字
 * @property { number } FOURTH_PRICE_COUNT 按顺序中全部 6 个数字
 * @property { number } FIFTH_PRICE_COUNT 按顺序中全部 5 个数字
 * @property { number } SIXTH_PRICE_COUNT 按顺序中全部 4 个数字
 * @property { number } SEVENTH_PRICE_COUNT 按顺序中全部 3 个数字
 * @property { number } TBG_WALLET_RECEIVER 拨入 TBG 钱包
 */
