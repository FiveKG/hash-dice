// @ts-check

/***
 * 1. 每日产币数量: 资产包购买数量 * 矿池产币倍数 / 预设可产币天数
 * 2. 私募每日产币数量: 全球合伙人私募数量 * 矿池产币倍数 / 预设可产币天数
 * 3. 购买资产包获得的可售额度: 可售额度数量 = ASSETS_PACKAGE_50 * SALEABLE_50
 * 4. 资产包进入线性释放池数量: 资产包购买数量 * 资产包进入线性释放池
 * 5. 每日线性释放数量: 线性释放池数量 * 会员每日线性释放比例
 */

// 预设可产币天数
const PRESET_DAYS = 500;

// 资产包购买数量
const ASSETS_PACKAGE_50 = 50;
const ASSETS_PACKAGE_100 = 100;
const ASSETS_PACKAGE_200 = 200;

// 全球合伙人私募数量
const RAISE_ASSETS_10K = 10 * 1000;
const RAISE_ASSETS_20K = 20 * 1000;
const RAISE_ASSETS_30K = 30 * 1000;

// 矿池产币倍数
const ASSETS_PACKAGE_MULTIPLE_50 = 2;
const ASSETS_PACKAGE_MULTIPLE_100 = 2.5;
const ASSETS_PACKAGE_MULTIPLE_200 = 3;
const RAISE_ASSETS_MULTIPLE_10K = 3;
const RAISE_ASSETS_MULTIPLE_20K = 3;
const RAISE_ASSETS_MULTIPLE_30K = 3;

// 资产包进入线性释放池倍数
const RELEASE_POOL_MULTIPLE_50 = 4;
const RELEASE_POOL_MULTIPLE_100 = 4.5;
const RELEASE_POOL_MULTIPLE_200 = 5;
const RELEASE_POOL_MULTIPLE_10K = 5;
const RELEASE_POOL_MULTIPLE_20K = 5;
const RELEASE_POOL_MULTIPLE_30K = 5;

// 购买资产包获得的可售额度比例
const SALEABLE_50 = 1.3;
const SALEABLE_100 = 1.4;
const SALEABLE_200 = 1.5;

// 会员每日线性释放比例 会员等级
// 未参与 TBG-I
const INACTIVATED_TBG_1 = 0.1;
// 海蓝
const SEA_BLUE = 0.1;
// 紫晶
const AMETHYST = 0.125;
// 黄金
const GOLD = 0.15;
// 红钻
const RED_DIAMOND = 0.175;
// 皇冠
const CROWN = 0.2;

// 未参与 TBG-I 每次最低可卖数量
const INACTIVATED_TBG_1_ONE_MIN_TRX = 3;
// 海蓝 每次最低可卖数量
const SEA_BLUE_ONE_MIN_TRX = 3;
// 紫晶 每次最低可卖数量
const AMETHYST_ONE_MIN_TRX = 4;
// 黄金 每次最低可卖数量
const GOLD_ONE_MIN_TRX = 6;
// 红钻 每次最低可卖数量
const RED_DIAMOND_ONE_MIN_TRX = 8;
// 皇冠 每次最低可卖数量
const CROWN_ONE_MIN_TRX = 10;

// 未参与 TBG-I 每次最高可卖数量
const INACTIVATED_TBG_1_ONE_MAX_TRX = 10;
// 海蓝 每次最高可卖数量
const SEA_BLUE_ONE_MAX_TRX = 100;
// 紫晶 每次最高可卖数量
const AMETHYST_ONE_MAX_TRX = 125;
// 黄金 每次最高可卖数量
const GOLD_ONE_MAX_TRX = 150;
// 红钻 每次最高可卖数量
const RED_DIAMOND_ONE_MAX_TRX = 175;
// 皇冠 每次最高可卖数量
const CROWN_ONE_MAX_TRX = 200;

// 未参与 TBG-I 单日最高可卖数量
const INACTIVATED_TBG_1_DAY_MAX_TRX = 10;
// 海蓝 单日最高可卖数量
const SEA_BLUE_DAY_MAX_TRX = 200;
// 紫晶 单日最高可卖数量
const AMETHYST_DAY_MAX_TRX = 250;
// 黄金 单日最高可卖数量
const GOLD_DAY_MAX_TRX = 300;
// 红钻 单日最高可卖数量
const RED_DIAMOND_DAY_MAX_TRX = 350;
// 皇冠 单日最高可卖数量
const CROWN_DAY_MAX_TRX = 400;

// 未参与 TBG-I 单日最多可卖次数
const INACTIVATED_TBG_1_DAY_TRX_COUNT = 1;
// 海蓝 单日最多可卖次数
const SEA_BLUE_DAY_TRX_COUNT = 2;
// 紫晶 单日最多可卖次数
const AMETHYST_DAY_TRX_COUNT = 2;
// 黄金 单日最多可卖次数
const GOLD_DAY_TRX_COUNT = 2;
// 红钻 单日最多可卖次数
const RED_DIAMOND_DAY_TRX_COUNT = 2;
// 皇冠 单日最多可卖次数
const CROWN_DAY_TRX_COUNT = 2;

const MEMBER_LEVEL = {
    "INACTIVATED_TBG_1": {
        "NAME": "未参与 TBG-I",
        "ID": "INACTIVATED_TBG_1"
    },
    "SEA_BLUE": {
        "NAME": "海蓝会员",
        "ID": "SEA_BLUE"
    },
    "AMETHYST": {
        "NAME": "紫晶会员",
        "ID": "AMETHYST"
    },
    "GOLD": {
        "NAME": "黄金会员",
        "ID": "GOLD"
    },
    "RED_DIAMOND": {
        "NAME": "红钻会员",
        "ID": "RED_DIAMOND"
    },
    "CROWN": {
        "NAME": "皇冠会员",
        "ID": "CROWN"
    },
}


const MEMBER_LEVEL_TRX = {
    "INACTIVATED_TBG_1": {
        "ONE_MIN_TRX": INACTIVATED_TBG_1_ONE_MIN_TRX,
        "ONE_MAX_TRX": INACTIVATED_TBG_1_ONE_MAX_TRX,
        "DAY_MAX_TRX": INACTIVATED_TBG_1_DAY_MAX_TRX,
        "DAY_TRX_COUNT": INACTIVATED_TBG_1_DAY_TRX_COUNT,
    },
    "SEA_BLUE": {
        "ONE_MIN_TRX": SEA_BLUE_ONE_MIN_TRX,
        "ONE_MAX_TRX": SEA_BLUE_ONE_MAX_TRX,
        "DAY_MAX_TRX": SEA_BLUE_DAY_MAX_TRX,
        "DAY_TRX_COUNT": SEA_BLUE_DAY_TRX_COUNT,
    },
    "AMETHYST": {
        "ONE_MIN_TRX": AMETHYST_ONE_MIN_TRX,
        "ONE_MAX_TRX": AMETHYST_ONE_MAX_TRX,
        "DAY_MAX_TRX": AMETHYST_DAY_MAX_TRX,
        "DAY_TRX_COUNT": AMETHYST_DAY_TRX_COUNT,
    },
    "GOLD": {
        "ONE_MIN_TRX": GOLD_ONE_MIN_TRX,
        "ONE_MAX_TRX": GOLD_ONE_MAX_TRX,
        "DAY_MAX_TRX": GOLD_DAY_MAX_TRX,
        "DAY_TRX_COUNT": GOLD_DAY_TRX_COUNT,
    },
    "RED_DIAMOND": {
        "ONE_MIN_TRX": RED_DIAMOND_ONE_MIN_TRX,
        "ONE_MAX_TRX": RED_DIAMOND_ONE_MAX_TRX,
        "DAY_MAX_TRX": RED_DIAMOND_DAY_MAX_TRX,
        "DAY_TRX_COUNT": RED_DIAMOND_DAY_TRX_COUNT,
    },
    "CROWN": {
        "ONE_MIN_TRX": CROWN_ONE_MIN_TRX,
        "ONE_MAX_TRX": CROWN_ONE_MAX_TRX,
        "DAY_MAX_TRX": CROWN_DAY_MAX_TRX,
        "DAY_TRX_COUNT": CROWN_DAY_TRX_COUNT,
    }
}

/**
 * 资产包进入资产包矿池规划
 * @type { Constant }
 */
const CONSTANT = {
    "PRESET_DAYS": PRESET_DAYS,
    "ASSETS_PACKAGE_50": ASSETS_PACKAGE_50,
    "ASSETS_PACKAGE_100": ASSETS_PACKAGE_100,
    "ASSETS_PACKAGE_200": ASSETS_PACKAGE_200,
    "RAISE_ASSETS_10K": RAISE_ASSETS_10K,
    "RAISE_ASSETS_20K": RAISE_ASSETS_20K,
    "RAISE_ASSETS_30K": RAISE_ASSETS_30K,
    "ASSETS_PACKAGE_MULTIPLE_50": ASSETS_PACKAGE_MULTIPLE_50,
    "ASSETS_PACKAGE_MULTIPLE_100": ASSETS_PACKAGE_MULTIPLE_100,
    "ASSETS_PACKAGE_MULTIPLE_200": ASSETS_PACKAGE_MULTIPLE_200,
    "RAISE_ASSETS_MULTIPLE_10K": RAISE_ASSETS_MULTIPLE_10K,
    "RAISE_ASSETS_MULTIPLE_20K": RAISE_ASSETS_MULTIPLE_20K,
    "RAISE_ASSETS_MULTIPLE_30K": RAISE_ASSETS_MULTIPLE_30K,
    "RELEASE_POOL_MULTIPLE_50": RELEASE_POOL_MULTIPLE_50,
    "RELEASE_POOL_MULTIPLE_100": RELEASE_POOL_MULTIPLE_100,
    "RELEASE_POOL_MULTIPLE_200": RELEASE_POOL_MULTIPLE_200,
    "RELEASE_POOL_MULTIPLE_10K": RELEASE_POOL_MULTIPLE_10K,
    "RELEASE_POOL_MULTIPLE_20K": RELEASE_POOL_MULTIPLE_20K,
    "RELEASE_POOL_MULTIPLE_30K": RELEASE_POOL_MULTIPLE_30K,
    "SALEABLE_50": SALEABLE_50,
    "SALEABLE_100": SALEABLE_100,
    "SALEABLE_200": SALEABLE_200,
    "INACTIVATED_TBG_1": INACTIVATED_TBG_1,
    "SEA_BLUE": SEA_BLUE,
    "AMETHYST": AMETHYST,
    "GOLD": GOLD,
    "RED_DIAMOND": RED_DIAMOND,
    "CROWN": CROWN,
    "MEMBER_LEVEL": MEMBER_LEVEL,
    "MEMBER_LEVEL_TRX": MEMBER_LEVEL_TRX
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } PRESET_DAYS 预设可产币天数
 * @property { number } ASSETS_PACKAGE_50 资产包购买数量
 * @property { number } ASSETS_PACKAGE_100  资产包购买数量
 * @property { number } ASSETS_PACKAGE_200 资产包购买数量
 * @property { number } RAISE_ASSETS_10K  全球合伙人私募数量
 * @property { number } RAISE_ASSETS_20K  全球合伙人私募数量
 * @property { number } RAISE_ASSETS_30K  全球合伙人私募数量
 * @property { number } ASSETS_PACKAGE_MULTIPLE_50  矿池产币倍数
 * @property { number } ASSETS_PACKAGE_MULTIPLE_100 矿池产币倍数
 * @property { number } ASSETS_PACKAGE_MULTIPLE_200 矿池产币倍数
 * @property { number } RAISE_ASSETS_MULTIPLE_10K 矿池产币倍数
 * @property { number } RAISE_ASSETS_MULTIPLE_20K 矿池产币倍数
 * @property { number } RAISE_ASSETS_MULTIPLE_30K 矿池产币倍数
 * @property { number } RELEASE_POOL_MULTIPLE_50  资产包进入线性释放池倍数
 * @property { number } RELEASE_POOL_MULTIPLE_100 资产包进入线性释放池倍数
 * @property { number } RELEASE_POOL_MULTIPLE_200 资产包进入线性释放池倍数
 * @property { number } RELEASE_POOL_MULTIPLE_10K 资产包进入线性释放池倍数
 * @property { number } RELEASE_POOL_MULTIPLE_20K 资产包进入线性释放池倍数
 * @property { number } RELEASE_POOL_MULTIPLE_30K 资产包进入线性释放池倍数
 * @property { number } SALEABLE_50 购买资产包获得的可售额度比例
 * @property { number } SALEABLE_100 购买资产包获得的可售额度比例
 * @property { number } SALEABLE_200 购买资产包获得的可售额度比例
 * @property { number } INACTIVATED_TBG_1 未参与 TBG-I
 * @property { number } SEA_BLUE 海蓝
 * @property { number } AMETHYST 紫晶
 * @property { number } GOLD 黄金
 * @property { number } RED_DIAMOND 红钻
 * @property { number } CROWN 皇冠
 * @property { MemberLevel } MEMBER_LEVEL
 * @property { MemberLevelTrx } MEMBER_LEVEL_TRX
 */

 /**
  * @description 会员等级信息
  * @typedef { Object } MemberLevel
  * @property { ML_INACTIVATED_TBG_1 } INACTIVATED_TBG_1 未参与 TBG-I
  * @property { ML_SEA_BLUE } SEA_BLUE 海蓝
  * @property { ML_AMETHYST } AMETHYST 紫晶
  * @property { ML_GOLD } GOLD 黄金
  * @property { ML_RED_DIAMOND } RED_DIAMOND 红钻
  * @property { ML_CROWN } CROWN 皇冠
  */

/**
  * @description 未参与 TBG-I 会员等级详情
  * @typedef { Object } ML_INACTIVATED_TBG_1
  * @property { string } NAME 未参与 TBG-I
  * @property { string } ID INACTIVATED_TBG_1
  */

  /**
  * @description 海蓝会员等级详情
  * @typedef { Object } ML_SEA_BLUE
  * @property { string } NAME 海蓝
  * @property { string } ID SEA_BLUE
  */

 /**
  * @description 紫晶会员等级详情
  * @typedef { Object } ML_AMETHYST
  * @property { string } NAME 紫晶
  * @property { string } ID AMETHYST
  */

/**
  * @description 黄金会员等级详情
  * @typedef { Object } ML_GOLD
  * @property { string } NAME 黄金
  * @property { string } ID GOLD
  */

/**
  * @description 红钻会员等级详情
  * @typedef { Object } ML_RED_DIAMOND
  * @property { string } NAME 红钻
  * @property { string } ID RED_DIAMOND
  */

/**
  * @description 皇冠会员等级详情
  * @typedef { Object } ML_CROWN
  * @property { string } NAME 未参与 TBG-I
  * @property { string } ID CROWN
  */

/**
  * @description 会员等级交易信息
  * @typedef { Object } MemberLevelTrx
  * @property { MLT_INACTIVATED_TBG_1 } INACTIVATED_TBG_1 未参与 TBG-I
  * @property { MLT_SEA_BLUE } SEA_BLUE 海蓝
  * @property { MLT_AMETHYST } AMETHYST 紫晶
  * @property { MLT_GOLD } GOLD 黄金
  * @property { MLT_RED_DIAMOND } RED_DIAMOND 红钻
  * @property { MLT_CROWN } CROWN 皇冠
  */

  /**
  * @description 未参与 TBG-I 会员等级交易信息
  * @typedef { Object } MLT_INACTIVATED_TBG_1
  * @property { number } ONE_MIN_TRX  未参与 TBG-I 每次最低可卖数量
  * @property { number } ONE_MAX_TRX 未参与 TBG-I 每次最高可卖数量
  * @property { number } DAY_MAX_TRX 未参与 TBG-I 单日最高可卖数量
  * @property { number } DAY_TRX_COUNT 未参与 TBG-I 单日最多可卖次数
  */

  /**
  * @description 海蓝会员等级交易信息
  * @typedef { Object } MLT_SEA_BLUE
  * @property { number } ONE_MIN_TRX 海蓝 每次最低可卖数量
  * @property { number } ONE_MAX_TRX 海蓝 每次最高可卖数量
  * @property { number } DAY_MAX_TRX 海蓝 单日最高可卖数量
  * @property { number } DAY_TRX_COUNT 海蓝 单日最多可卖次数
  */

 /**
  * @description 紫晶会员等级交易信息
  * @typedef { Object } MLT_AMETHYST
  * @property { number } ONE_MIN_TRX 紫晶 每次最低可卖数量
  * @property { number } ONE_MAX_TRX 紫晶 每次最高可卖数量
  * @property { number } DAY_MAX_TRX 紫晶 单日最高可卖数量
  * @property { number } DAY_TRX_COUNT 紫晶 单日最多可卖次数
  */

/**
  * @description 红钻黄金会员等级交易信息
  * @typedef { Object } MLT_GOLD
  * @property { number } ONE_MIN_TRX 黄金 每次最低可卖数量
  * @property { number } ONE_MAX_TRX 黄金 每次最高可卖数量
  * @property { number } DAY_MAX_TRX 黄金 单日最高可卖数量
  * @property { number } DAY_TRX_COUNT 黄金 单日最多可卖次数
  */

/**
  * @description 皇冠会员等级交易信息
  * @typedef { Object } MLT_RED_DIAMOND
  * @property { number } ONE_MIN_TRX 红钻 每次最低可卖数量
  * @property { number } ONE_MAX_TRX 红钻 每次最高可卖数量
  * @property { number } DAY_MAX_TRX 红钻 单日最高可卖数量
  * @property { number } DAY_TRX_COUNT 红钻 单日最多可卖次数
  */

/**
  * @description 会员等级交易信息
  * @typedef { Object } MLT_CROWN
  * @property { number } ONE_MIN_TRX 皇冠 每次最低可卖数量
  * @property { number } ONE_MAX_TRX 皇冠 每次最高可卖数量
  * @property { number } DAY_MAX_TRX 皇冠 单日最高可卖数量
  * @property { number } DAY_TRX_COUNT 皇冠 单日最多可卖次数
  */