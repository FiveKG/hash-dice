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
const RAISE_ASSETS_10K = 10 * 100;
const RAISE_ASSETS_20K = 20 * 100;
const RAISE_ASSETS_30K = 30 * 100;

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
// 未参与TBG-I
const INACTIVATED_TBG_1 = 0.1
// 海蓝
const SEA_BLUE = 0.1
// 紫晶
const AMETHYST = 0.125
// 黄金
const GOLD = 0.15
// 红钻
const RED_DIAMOND = 0.175
// 皇冠
const CROWN = 0.2

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
    "CROWN": CROWN
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
 * @property { number } INACTIVATED_TBG_1 未参与TBG-I
 * @property { number } SEA_BLUE 海蓝
 * @property { number } AMETHYST 紫晶
 * @property { number } GOLD 黄金
 * @property { number } RED_DIAMOND 红钻
 * @property { number } CROWN 皇冠
 */