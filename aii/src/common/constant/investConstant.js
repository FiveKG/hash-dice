// @ts-check

// 投资额度
const INVEST_AMOUNT = 100;

// 百分率
const BASE_RATE = 1000;
// 直接推荐奖励的百分比
const REFER_INCOME_RATE = 100;
// 分配给五倍收益保障池的额度的百分比
const SAFE_INCOME_RATE = 250;
// 三三静态的百分比
const MODE_INCOME_RATE = 150;
// 一行公排的百分比
const SORT_INCOME_RATE = 150;
// 分配给 bingo 奖金池的百分比
const BINGO_INCOME_RATE = 100;
// 分配给股东分红奖金池的百分比
const SHAREHOLDERS_INCOME_RATE = 150;
// 分配给 pk 奖金池的百分比
const PK_INCOME_RATE = 50;
// 分配给全球合伙人额度的百分比
const GLOBAL_PARTNER = 10;
// 分配给全球合伙人的推荐人额度的百分比
const GLOBAL_PARTNER_REFERRER = 5;
// 分配给社区额度的百分比
const COMMUNITY_INCOME_RATE = 21;
// 分配给开发维护的额度的百分比
const DEV_OP_INCOME_RATE = 14;


/**
 * @type { Constant }
 */
const CONSTANT = {
    "INVEST_AMOUNT": INVEST_AMOUNT,
    "BASE_RATE": BASE_RATE,
    "REFER_INCOME_RATE": REFER_INCOME_RATE,
    "SAFE_INCOME_RATE": SAFE_INCOME_RATE,
    "MODE_INCOME_RATE": MODE_INCOME_RATE,
    "SORT_INCOME_RATE": SORT_INCOME_RATE,
    "BINGO_INCOME_RATE": BINGO_INCOME_RATE,
    "SHAREHOLDERS_INCOME_RATE": SHAREHOLDERS_INCOME_RATE,
    "PK_INCOME_RATE": PK_INCOME_RATE,
    "GLOBAL_PARTNER": GLOBAL_PARTNER,
    "GLOBAL_PARTNER_REFERRER": GLOBAL_PARTNER_REFERRER,
    "COMMUNITY_INCOME_RATE": COMMUNITY_INCOME_RATE,
    "DEV_OP_INCOME_RATE": DEV_OP_INCOME_RATE,
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { Number } INVEST_AMOUNT 投资额度
 * @property { Number } BASE_RATE 百分率
 * @property { Number } REFER_INCOME_RATE  直接推荐奖励的百分比
 * @property { Number } SAFE_INCOME_RATE  分配给五倍收益保障池的额度的百分比
 * @property { Number } MODE_INCOME_RATE  三三静态的百分比
 * @property { Number } SORT_INCOME_RATE  一行公排的百分比
 * @property { Number } BINGO_INCOME_RATE  分配给 bingo 奖金池的百分比
 * @property { Number } SHAREHOLDERS_INCOME_RATE  分配给股东分红奖金池的百分比
 * @property { Number } PK_INCOME_RATE  分配给 pk 奖金池的百分比
 * @property { Number } GLOBAL_PARTNER  分配给全球合伙人额度的百分比
 * @property { Number } GLOBAL_PARTNER_REFERRER  分配给全球合伙人的推荐人额度的百分比
 * @property { Number } COMMUNITY_INCOME_RATE  分配给社区额度的百分比
 * @property { Number } DEV_OP_INCOME_RATE  分配给开发维护的额度的百分比
 */