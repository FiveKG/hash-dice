// @ts-check


const BASE_RATE = 100;

// 全球彩庄家
const GLOBAL_LOTTO_BANKER = "lottobanker"

// 分发中心收益账号
const DISTRIBUTION_CENTER_ACCOUNT = "eoscentereos"

// 全球彩代投注账号
const AGENT_ACCOUNT = "globallotto"

// 全球彩合约帐号
const GLOBAL_LOTTO_CONTRACT = "globallotto";

// 全球彩
const GLOBAL_LOTTO_ACCOUNT = "eoslottoeos"

// 钱包收款帐号
const TBG_WALLET_RECEIVER = 'tbgreceiver'

// 夺宝庄家
const TREASURE_BANKER = "snatchbanker"

// 夺宝代投注账号，除全球彩外，所有游戏的代投帐号
const TREASURE_AGENT_ACCOUNT = "eosbankereos"

// 夺宝合约帐号
const TREASURE_CONTRACT = "eossnatcheos";


// 夺宝 1% 拨入 TBG 股东分红池；
const TREASURE_ALLOC_TO_TSH_POOL = 1;
// 夺宝 1% 拨入 TBG 三倍收益保障池；
const TREASURE_ALLOC_TO_PROTECTION_POOL = 1;
// 夺宝 3% 拨入 TBG 共享推荐佣金分配；
const TREASURE_ALLOC_TO_REFERRER = 3;
// 夺宝 1.5% TSH投资股东收益
const TREASURE_ALLOC_TO_TSH_INCOME = 1.5;

// 全球彩 1% 拨入 TBG 股东分红池；
const GLOBAL_LOTTO_ALLOC_TO_TSH_POOL = 1;
// 全球彩 1% 拨入 TBG 三倍收益保障池；
const GLOBAL_LOTTO_ALLOC_TO_PROTECTION_POOL = 1;
// 全球彩 5% 拨入 TBG 共享推荐佣金分配；
const GLOBAL_LOTTO_ALLOC_TO_REFERRER = 5;
// 全球彩 1.5% TSH投资股东收益
const GLOBAL_LOTTO_ALLOC_TO_TSH_INCOME = 1.5;

// 红包 0.5% 拨入 TBG 股东分红池；
const HONG_BAO_ALLOC_TO_TSH_POOL = 0.5;
// 红包 0.5% 拨入 TBG 三倍收益保障池；
const HONG_BAO_ALLOC_TO_PROTECTION_POOL = 0.5;
// 红包 2% 拨入 TBG 共享推荐佣金分配；
const HONG_BAO_ALLOC_TO_REFERRER = 2;
// 红包 0.6% TSH投资股东收益
const HONG_BAO_ALLOC_TO_TSH_INCOME = 0.6;

// 哈希骰子 0.1% 拨入 TBG 股东分红池；
const HASH_DICE_ALLOC_TO_TSH_POOL = 0.1;
// 哈希骰子 0.1% 拨入 TBG 三倍收益保障池；
const HASH_DICE_ALLOC_TO_PROTECTION_POOL = 0.1;
// 哈希骰子 0.3% 拨入 TBG 共享推荐佣金分配；
const HASH_DICE_ALLOC_TO_REFERRER = 0.3;
// 哈希骰子 0.3% TSH投资股东收益
const HASH_DICE_ALLOC_TO_TSH_INCOME = 0.3;

// 哈希分分彩 0.1% 拨入 TBG 股东分红池；
const MIN_LOTTERY_ALLOC_TO_TSH_POOL = 0.1;
// 哈希分分彩 0.1% 拨入 TBG 三倍收益保障池；
const MIN_LOTTERY_ALLOC_TO_PROTECTION_POOL = 0.1;
// 哈希分分彩 0.3% 拨入 TBG 共享推荐佣金分配；
const MIN_LOTTERY_ALLOC_TO_REFERRER = 0.3;
// 哈希分分彩 0.3% TSH投资股东收益
const MIN_LOTTERY_ALLOC_TO_TSH_INCOME = 0.3;

/**
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "GLOBAL_LOTTO_BANKER": GLOBAL_LOTTO_BANKER,
    "DISTRIBUTION_CENTER_ACCOUNT": DISTRIBUTION_CENTER_ACCOUNT,
    "AGENT_ACCOUNT": AGENT_ACCOUNT,
    "GLOBAL_LOTTO_CONTRACT": GLOBAL_LOTTO_CONTRACT,
    "GLOBAL_LOTTO_ACCOUNT": GLOBAL_LOTTO_ACCOUNT,
    "TBG_WALLET_RECEIVER": TBG_WALLET_RECEIVER,
    "TREASURE_BANKER": TREASURE_BANKER,
    "TREASURE_AGENT_ACCOUNT": TREASURE_AGENT_ACCOUNT,
    "TREASURE_CONTRACT": TREASURE_CONTRACT,
    "TREASURE_ALLOC_TO_TSH_POOL": TREASURE_ALLOC_TO_TSH_POOL,
    "TREASURE_ALLOC_TO_PROTECTION_POOL": TREASURE_ALLOC_TO_PROTECTION_POOL,
    "TREASURE_ALLOC_TO_REFERRER": TREASURE_ALLOC_TO_REFERRER,
    "TREASURE_ALLOC_TO_TSH_INCOME": TREASURE_ALLOC_TO_TSH_INCOME,
    "GLOBAL_LOTTO_ALLOC_TO_TSH_POOL": GLOBAL_LOTTO_ALLOC_TO_TSH_POOL,
    "GLOBAL_LOTTO_ALLOC_TO_PROTECTION_POOL": GLOBAL_LOTTO_ALLOC_TO_PROTECTION_POOL,
    "GLOBAL_LOTTO_ALLOC_TO_REFERRER": GLOBAL_LOTTO_ALLOC_TO_REFERRER,
    "GLOBAL_LOTTO_ALLOC_TO_TSH_INCOME": GLOBAL_LOTTO_ALLOC_TO_TSH_INCOME,
    "HONG_BAO_ALLOC_TO_TSH_POOL": HONG_BAO_ALLOC_TO_TSH_POOL,
    "HONG_BAO_ALLOC_TO_PROTECTION_POOL": HONG_BAO_ALLOC_TO_PROTECTION_POOL,
    "HONG_BAO_ALLOC_TO_REFERRER": HONG_BAO_ALLOC_TO_REFERRER,
    "HONG_BAO_ALLOC_TO_TSH_INCOME": HONG_BAO_ALLOC_TO_TSH_INCOME,
    "HASH_DICE_ALLOC_TO_TSH_POOL": HASH_DICE_ALLOC_TO_TSH_POOL,
    "HASH_DICE_ALLOC_TO_PROTECTION_POOL": HASH_DICE_ALLOC_TO_PROTECTION_POOL,
    "HASH_DICE_ALLOC_TO_REFERRER": HASH_DICE_ALLOC_TO_REFERRER,
    "HASH_DICE_ALLOC_TO_TSH_INCOME": HASH_DICE_ALLOC_TO_TSH_INCOME,
    "MIN_LOTTERY_ALLOC_TO_TSH_POOL": MIN_LOTTERY_ALLOC_TO_TSH_POOL,
    "MIN_LOTTERY_ALLOC_TO_PROTECTION_POOL": MIN_LOTTERY_ALLOC_TO_PROTECTION_POOL,
    "MIN_LOTTERY_ALLOC_TO_REFERRER": MIN_LOTTERY_ALLOC_TO_REFERRER,
    "MIN_LOTTERY_ALLOC_TO_TSH_INCOME": MIN_LOTTERY_ALLOC_TO_TSH_INCOME,
}

module.exports = CONSTANT

/**
 * @description 
 * @typedef { Object } Constant
 * @property { number } BASE_RATE
 * @property { string } GLOBAL_LOTTO_BANKER 全球彩庄家
 * @property { string } DISTRIBUTION_CENTER_ACCOUNT 分发中心收益账号
 * @property { string } AGENT_ACCOUNT 全球彩代投注账号
 * @property { string } GLOBAL_LOTTO_CONTRACT 全球彩合约帐号
 * @property { string } GLOBAL_LOTTO_ACCOUNT 全球彩
 * @property { string } TBG_WALLET_RECEIVER 钱包收款帐号
 * @property { string } TREASURE_BANKER 夺宝庄家
 * @property { string } TREASURE_AGENT_ACCOUNT 夺宝代投注账号，除全球彩外，所有游戏的代投帐号
 * @property { string } TREASURE_CONTRACT 夺宝合约帐号
 * @property { number } TREASURE_ALLOC_TO_TSH_POOL 夺宝 1% 拨入 TBG 股东分红池；
 * @property { number } TREASURE_ALLOC_TO_PROTECTION_POOL 夺宝 1% 拨入 TBG 三倍收益保障池；
 * @property { number } TREASURE_ALLOC_TO_REFERRER 夺宝 3% 拨入 TBG 共享推荐佣金分配；
 * @property { number } TREASURE_ALLOC_TO_TSH_INCOME 夺宝 1.5% TSH投资股东收益
 * @property { number } GLOBAL_LOTTO_ALLOC_TO_TSH_POOL 全球彩 1% 拨入 TBG 股东分红池；
 * @property { number } GLOBAL_LOTTO_ALLOC_TO_PROTECTION_POOL 全球彩 1% 拨入 TBG 三倍收益保障池；
 * @property { number } GLOBAL_LOTTO_ALLOC_TO_REFERRER 全球彩 5% 拨入 TBG 共享推荐佣金分配；
 * @property { number } GLOBAL_LOTTO_ALLOC_TO_TSH_INCOME 全球彩 1.5% TSH投资股东收益
 * @property { number } HONG_BAO_ALLOC_TO_TSH_POOL 红包 0.5% 拨入 TBG 股东分红池；
 * @property { number } HONG_BAO_ALLOC_TO_PROTECTION_POOL 红包 0.5% 拨入 TBG 三倍收益保障池；
 * @property { number } HONG_BAO_ALLOC_TO_REFERRER 红包 2% 拨入 TBG 共享推荐佣金分配；
 * @property { number } HONG_BAO_ALLOC_TO_TSH_INCOME 红包 0.6% TSH投资股东收益
 * @property { number } HASH_DICE_ALLOC_TO_TSH_POOL 哈希骰子 0.1% 拨入 TBG 股东分红池；
 * @property { number } HASH_DICE_ALLOC_TO_PROTECTION_POOL 哈希骰子 0.1% 拨入 TBG 三倍收益保障池；
 * @property { number } HASH_DICE_ALLOC_TO_REFERRER 哈希骰子 0.3% 拨入 TBG 共享推荐佣金分配；
 * @property { number } HASH_DICE_ALLOC_TO_TSH_INCOME 哈希骰子 0.3% TSH投资股东收益
 * @property { number } MIN_LOTTERY_ALLOC_TO_TSH_POOL 哈希分分彩 0.1% 拨入 TBG 股东分红池；
 * @property { number } MIN_LOTTERY_ALLOC_TO_PROTECTION_POOL 哈希分分彩 0.1% 拨入 TBG 三倍收益保障池；
 * @property { number } MIN_LOTTERY_ALLOC_TO_REFERRER 哈希分分彩 0.3% 拨入 TBG 共享推荐佣金分配；
 * @property { number } MIN_LOTTERY_ALLOC_TO_TSH_INCOME 哈希分分彩 0.3% TSH投资股东收益
 */