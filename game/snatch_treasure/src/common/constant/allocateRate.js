// @ts-check

const BASE_RATE = 100;

// 90% 拨入 夺宝奖池；
const ALLOC_TO_SNATCH_PRIZE_POOL = 90
// 分发中心收益
const DISTRIBUTION_CENTER = 3.5;

// 拨入 TBG 钱包
const TBG_WALLET_RECEIVER = 6.5;

// 1% 拨入 TBG 股东分红池；
const ALLOC_TO_TSH_POOL = 1;
// 1% 拨入 TBG 三倍收益保障池；
const ALLOC_TO_PROTECTION_POOL = 1;
// 3% 拨入 TBG 共享推荐佣金分配；
const ALLOC_TO_REFERRER = 3;
// 1.5% TSH投资股东收益
const ALLOC_TO_TSH_INCOME = 1.5;


/**
 * TBG发币规划
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "ALLOC_TO_SNATCH_PRIZE_POOL": ALLOC_TO_SNATCH_PRIZE_POOL,
    "DISTRIBUTION_CENTER": DISTRIBUTION_CENTER,
    "ALLOC_TO_TSH_POOL": ALLOC_TO_TSH_POOL,
    "ALLOC_TO_TSH_INCOME": ALLOC_TO_TSH_INCOME,
    "ALLOC_TO_PROTECTION_POOL": ALLOC_TO_PROTECTION_POOL,
    "ALLOC_TO_REFERRER": ALLOC_TO_REFERRER,
    "TBG_WALLET_RECEIVER": TBG_WALLET_RECEIVER
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } BASE_RATE 
 * @property { number } ALLOC_TO_SNATCH_PRIZE_POOL 90% 拨入 夺宝奖池；
 * @property { number } DISTRIBUTION_CENTER 分发中心收益
 * @property { number } ALLOC_TO_TSH_POOL 1% 拨入 TBG 股东分红池；
 * @property { number } ALLOC_TO_TSH_INCOME 1% 拨入 TBG 三倍收益保障池；
 * @property { number } ALLOC_TO_PROTECTION_POOL 3% 拨入 TBG 共享推荐佣金分配；
 * @property { number } ALLOC_TO_REFERRER 1% TSH投资股东收益
 * @property { number } TBG_WALLET_RECEIVER 6.5% 拨入 TBG 钱包
 */
