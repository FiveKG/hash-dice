// @ts-check

// PK 奖金池可获取奖励的用户可得比例
const BASE_RATE = 100;
const PK_INCOME_FIRST = 30;
const PK_INCOME_SECOND = 20;
const PK_INCOME_THIRD = 15;
const PK_INCOME_FOURTH = 10;
const PK_INCOME_FIFTH = 8;
const PK_INCOME_SIXTH = 6;
const PK_INCOME_SEVENTH = 5;
const PK_INCOME_EIGHTH = 3;
const PK_INCOME_NINTH = 2;
const PK_INCOME_TENTH = 1;

// BINGO 奖金池可获取奖励的用户可得比例
const BINGO_INCOME_FIRST = 50;
const BINGO_INCOME_OTHER = 50;

// 社区和开发可分配的占比
const DEV_INCOME = 40;
const COMMUNITY_INCOME = 60;

// 一行公排获取奖励的用户可得比例
const SORT_INCOME = 25;
// 一行公排可获奖的出线额度
const SORT_OUT_LINE = 250;

// 三倍收益保障池可获奖的出线额度
const SAFE_OUT_LINE = 6000;

/**
 * 向上层级 分配比例 可分配
 * 1 50% 100.0000 UE
 * 2 25% 50.0000 UE
 * 3 1% 2.0000 UE
 * 4 1.5% 3.0000 UE
 * 5 2% 4.0000 UE
 * 6 2.5% 5.0000 UE
 * 7 3% 6.0000 UE
 * 8 5% 10.0000 UE
 * 9 10% 20.0000 UE
 * 合计 100.00% 10.0000
 */

const REFER_FIRST_LEVEL = 50;
const REFER_SECOND_LEVEL = 25;
const REFER_THIRD_LEVEL = 1;
const REFER_FOURTH_LEVEL = 1.5;
const REFER_FIFTH_LEVEL = 2;
const REFER_SIXTH_LEVEL = 2.5;
const REFER_SEVENTH_LEVEL = 3;
const REFER_EIGHTH_LEVEL = 5;
const REFER_NINTH_LEVEL = 10;


// 百分率, 奖池每次可分配的额度比例
// 直接推荐 PK 奖池每周分配占比
const REFER_PK_ALLOCATE_RATE = 30;
// 三倍收益保障池每天分配占比
const SAFE_ALLOCATE_RATE = 30;
// bingo 奖金池每天分配占比
const BINGO_ALLOCATE_RATE = 70;
// 股东分红奖金池每天分配占比
const SHAREHOLDERS_ALLOCATE_RATE = 10;

// 节点激励池的30%作为每周奖金发放总额
const NODE_INCENTIVE_RATE = 30;
const NODE_INCENTIVE_V1 = 10;
const NODE_INCENTIVE_V2 = 15;
const NODE_INCENTIVE_V3 = 20;
const NODE_INCENTIVE_V4 = 25;
const NODE_INCENTIVE_V5 = 30;

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
    "PK_INCOME_SIXTH": PK_INCOME_SIXTH,
    "PK_INCOME_SEVENTH": PK_INCOME_SEVENTH,
    "PK_INCOME_EIGHTH": PK_INCOME_EIGHTH,
    "PK_INCOME_NINTH": PK_INCOME_NINTH,
    "PK_INCOME_TENTH": PK_INCOME_TENTH,
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
    "SAFE_OUT_LINE": SAFE_OUT_LINE,
    "REFER_FIRST_LEVEL": REFER_FIRST_LEVEL,
    "REFER_SECOND_LEVEL": REFER_SECOND_LEVEL,
    "REFER_THIRD_LEVEL": REFER_THIRD_LEVEL,
    "REFER_FOURTH_LEVEL": REFER_FOURTH_LEVEL,
    "REFER_FIFTH_LEVEL": REFER_FIFTH_LEVEL,
    "REFER_SIXTH_LEVEL": REFER_SIXTH_LEVEL,
    "REFER_SEVENTH_LEVEL": REFER_SEVENTH_LEVEL,
    "REFER_EIGHTH_LEVEL": REFER_EIGHTH_LEVEL,
    "REFER_NINTH_LEVEL": REFER_NINTH_LEVEL,
    "NODE_INCENTIVE_RATE": NODE_INCENTIVE_RATE,
    "NODE_INCENTIVE_V1": NODE_INCENTIVE_V1,
    "NODE_INCENTIVE_V2": NODE_INCENTIVE_V2,
    "NODE_INCENTIVE_V3": NODE_INCENTIVE_V3,
    "NODE_INCENTIVE_V4": NODE_INCENTIVE_V4,
    "NODE_INCENTIVE_V5": NODE_INCENTIVE_V5,
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } BASE_RATE 
 * @property { number } PK_INCOME_FIRST PK 第一名
 * @property { number } PK_INCOME_SECOND  PK 第二名
 * @property { number } PK_INCOME_THIRD  PK 第三名
 * @property { number } PK_INCOME_FOURTH  PK 第四名
 * @property { number } PK_INCOME_FIFTH  PK 第五名
 * @property { number } PK_INCOME_SIXTH PK 第六名
 * @property { number } PK_INCOME_SEVENTH  PK 第七名
 * @property { number } PK_INCOME_EIGHTH  PK 第八名
 * @property { number } PK_INCOME_NINTH  PK 第九名
 * @property { number } PK_INCOME_TENTH  PK 第十名
 * @property { number } BINGO_INCOME_FIRST  BINGO 第一名
 * @property { number } BINGO_INCOME_OTHER  BINGO 第二名
 * @property { number } DEV_INCOME      开发可分配的占比
 * @property { number } COMMUNITY_INCOME  社区可分配的占比
 * @property { number } REFER_PK_ALLOCATE_RATE  直接推荐 PK 奖池每周分配占比
 * @property { number } SAFE_ALLOCATE_RATE  三倍收益保障池每天分配占比
 * @property { number } BINGO_ALLOCATE_RATE  bingo 奖金池每天分配占比
 * @property { number } SHAREHOLDERS_ALLOCATE_RATE  股东分红奖金池比例
 * @property { number } SORT_INCOME 一行公排获取奖励的用户可得比例
 * @property { number } SORT_OUT_LINE 一行公排可获奖的出线额度
 * @property { number } SAFE_OUT_LINE 三倍收益保障池可获奖的出线额度
 * @property { number } REFER_FIRST_LEVEL 
 * @property { number } REFER_SECOND_LEVEL 
 * @property { number } REFER_THIRD_LEVEL 
 * @property { number } REFER_FOURTH_LEVEL
 * @property { number } REFER_FIFTH_LEVEL
 * @property { number } REFER_SIXTH_LEVEL
 * @property { number } REFER_SEVENTH_LEVEL
 * @property { number } REFER_EIGHTH_LEVEL
 * @property { number } REFER_NINTH_LEVEL
 * @property { number } NODE_INCENTIVE_RATE
 * @property { number } NODE_INCENTIVE_V1
 * @property { number } NODE_INCENTIVE_V2
 * @property { number } NODE_INCENTIVE_V3
 * @property { number } NODE_INCENTIVE_V4
 * @property { number } NODE_INCENTIVE_V5
 */