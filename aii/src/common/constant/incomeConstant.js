// @ts-check

// PK 奖金池可获取奖励的用户可得比例
const BASE_RATE = 100;
const PK_INCOME_FIRST = 40;
const PK_INCOME_SECOND = 30;
const PK_INCOME_THIRD = 15;
const PK_INCOME_FOURTH = 10;
const PK_INCOME_FIFTH = 5;

// BINGO 奖金池可获取奖励的用户可得比例
const BINGO_INCOME_FIRST = 50;
const BINGO_INCOME_OTHER = 50;

// 社区和开发可分配的占比
const DEV_INCOME = 40;
const COMMUNITY_INCOME = 60;

// 一行公排获取奖励的用户可得比例
const SORT_INCOME = 25;
// 一行公排可获奖的出线额度
const SORT_OUT_LINE = 20;

// 三倍收益保障池可获奖的出线额度
const SAFE_OUT_LINE = 300;


// 百分率, 奖池每次可分配的额度比例
// 直接推荐 PK 奖池每周分配占比
const REFER_PK_ALLOCATE_RATE = 30;
// 三倍收益保障池每天分配占比
const SAFE_ALLOCATE_RATE = 10;
// bingo 奖金池每天分配占比
const BINGO_ALLOCATE_RATE = 70;
// 股东分红奖金池每天分配占比
const SHAREHOLDERS_ALLOCATE_RATE = 10;

/**
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "PK_INCOME_FIRST": PK_INCOME_FIRST,
    "PK_INCOME_SECOND": PK_INCOME_SECOND,
    "PK_INCOME_THIRD": PK_INCOME_THIRD,
    "PK_INCOME_FOURTH": PK_INCOME_FOURTH,
    "PK_INCOME_FIFTH": PK_INCOME_FIFTH,
    "BINGO_INCOME_FIRST": BINGO_INCOME_FIRST,
    "BINGO_INCOME_OTHER": BINGO_INCOME_OTHER,
    "DEV_INCOME": DEV_INCOME,
    "COMMUNITY_INCOME": COMMUNITY_INCOME,
    "REFER_PK_ALLOCATE_RATE": REFER_PK_ALLOCATE_RATE,
    "SAFE_ALLOCATE_RATE": SAFE_ALLOCATE_RATE,
    "BINGO_ALLOCATE_RATE": BINGO_ALLOCATE_RATE,
    "SHAREHOLDERS_ALLOCATE_RATE": SHAREHOLDERS_ALLOCATE_RATE,
    "SORT_INCOME": SORT_INCOME,
    "SORT_OUT_LINE": SORT_OUT_LINE,
    "SAFE_OUT_LINE": SAFE_OUT_LINE
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { Number } BASE_RATE 
 * @property { Number } PK_INCOME_FIRST PK 第一名
 * @property { Number } PK_INCOME_SECOND  PK 第二名
 * @property { Number } PK_INCOME_THIRD  PK 第三名
 * @property { Number } PK_INCOME_FOURTH  PK 第四名
 * @property { Number } PK_INCOME_FIFTH  PK 第五名
 * @property { Number } BINGO_INCOME_FIRST  BINGO 第一名
 * @property { Number } BINGO_INCOME_OTHER  BINGO 第二名
 * @property { Number } DEV_INCOME      开发可分配的占比
 * @property { Number } COMMUNITY_INCOME  社区可分配的占比
 * @property { Number } REFER_PK_ALLOCATE_RATE  直接推荐 PK 奖池每周分配占比
 * @property { Number } SAFE_ALLOCATE_RATE  三倍收益保障池每天分配占比
 * @property { Number } BINGO_ALLOCATE_RATE  bingo 奖金池每天分配占比
 * @property { Number } SHAREHOLDERS_ALLOCATE_RATE  股东分红奖金池每天分配占比
 * @property { Number } SORT_INCOME 一行公排获取奖励的用户可得比例
 * @property { Number } SORT_OUT_LINE 一行公排可获奖的出线额度
 * @property { Number } SAFE_OUT_LINE 三倍收益保障池可获奖的出线额度
 */