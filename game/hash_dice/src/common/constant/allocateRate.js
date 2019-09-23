// @ts-check

/***
 * 1. 0.8% 拨入TBG钱包；
 /**
  * TBG钱包再分配
 * 1. 0.1% 拨入TBG股东分红池;
 * 2. 0.1% 拨入TBG三倍保障池;
 * 3. 0.3% TBG推荐佣金;
 * 4. 0.3% TSH投资股东收益;
  */
const BASE_RATE = 100;


// 0.1% 拨入 TBG 股东分红池；
const ALLOC_TO_TSH_POOL = 0.1;
// 0.1% 拨入 TBG 三倍收益保障池；
const ALLOC_TO_PROTECTION_POOL = 0.1;
// 0.3% 拨入 TBG 共享推荐佣金分配；
const ALLOC_TO_REFERRER = 0.3;
// 0.3% TSH投资股东收益
const ALLOC_TO_TSH_INCOME =0.3;



/**
 * TBG发币规划
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "ALLOC_TO_TSH_INCOME": ALLOC_TO_TSH_INCOME,
    "ALLOC_TO_PROTECTION_POOL": ALLOC_TO_PROTECTION_POOL,
    "ALLOC_TO_REFERRER": ALLOC_TO_REFERRER,
    "ALLOC_TO_TSH_POOL": ALLOC_TO_TSH_POOL,
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } BASE_RATE 
 * @property { number } ALLOC_TO_TSH_POOL 0.1% 拨入 TBG 股东分红池；
 * @property { number } ALLOC_TO_PROTECTION_POOL 0.1% 拨入 TBG 三倍收益保障池；
 * @property { number } ALLOC_TO_REFERRER 0.3% 拨入 TBG 共享推荐佣金分配；
 * @property { number } ALLOC_TO_TSH_INCOME 0.3% TSH投资股东收益
 */
