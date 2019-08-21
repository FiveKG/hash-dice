// @ts-check

/***
 * 1. TBG 总计发行: 1,000,000,000.0000
 *  * 挖矿及空投: 80%
 *      * 绑定 TBG 推荐关系即空投 30TBG，前 100,000 个 UE 账号: 0.3%
 *      * 参与 TBG-I 即空投 150TBG，前 300,000 个UE账号，复投不再空投: 4.5%
 *      * 每日签到空投: 0.2%
 *      * 游戏空投: 5%
 *      * 资产包挖矿: 75%
 *  * TBG基金，作为长期社区建设、管理等费用，逐步释放: 5%
 *  * TBG区块链实验室，作为区块链技术研发费用，6年逐步释放: 15%
 * 
 * 2. 游戏空投数量: 总计发行 * 游戏空投 / BASE_RATE
 *  * 游戏每投注 1 UE, TBG 空投 0.05 TBG: 
 *      每注可获得的空投 = 游戏投注 UE 数量 * GAME_AIRDROP_INCOME / BASE_RATE
 * 
 * 3. 每日签到空投数量: 总计发行 * 每日签到空投 / BASE_RATE
 *  * 每日签到奖励，奖励划入线性释放池
 *  * 有中断则又从第1天开始, 连续7日再从第1天开始
 *  * 下方定义的常量值即为签到奖励金额
 */
const BASE_RATE = 100;

// 绑定 TBG 推荐关系即空投 30TBG，前 100,000 个 UE 账号
const BIND_AIRDROP = 0.3;
// 前 100,000 个 UE 账号
const BIND_MEMBER_LIMIT = 100000;
// 推荐人空投 10
const BIND_REFERRER_AIRDROP = 10;
// 账户空投 20
const BIND_ACCOUNT_AIRDROP = 20;

// 参与 TBG-I 即空投 150TBG，前 300,000 个UE账号，复投不再空投
const TBG_1_AIRDROP = 4.5;
// 前 300,000 个 UE 账号
const TBG_1_MEMBER_LIMIT = 300000;
// 推荐人空投 50
const TBG_1_REFERRER_AIRDROP = 100;
// 账户空投 100
const TBG_1_ACCOUNT_AIRDROP = 50;

// 每日签到空投
const CHECK_IN_AIRDROP = 0.2;
// 游戏空投
const GAME_AIRDROP = 5;

// 游戏每投注 1 UE, TBG空投 0.05 TBG
const GAME_AIRDROP_INCOME = 5;

// 每日签到奖励，奖励划入线性释放池
const CHECK_IN_AIRDROP_1 = 0.01;
const CHECK_IN_AIRDROP_2 = 0.02;
const CHECK_IN_AIRDROP_3 = 0.03;
const CHECK_IN_AIRDROP_4 = 0.04;
const CHECK_IN_AIRDROP_5 = 0.05;
const CHECK_IN_AIRDROP_6 = 0.06;
const CHECK_IN_AIRDROP_7 = 0.07;

// 资产包挖矿
const MINING_AIRDROP = 75;

// TBG 基金，作为长期社区建设、管理等费用，逐步释放
const FUND_CURRENCY = 5;
// TBG 区块链实验室，作为区块链技术研发费用，6年逐步释放
const LABORATORY_CURRENCY = 15;

const BIND_AIRDROP_ID = "bind_airdrop";
const TBG_1_AIRDROP_ID = "tbg_1_airdrop";
const CHECK_IN_AIRDROP_ID = "check_in_airdrop";
const GAME_AIRDROP_ID = "game_airdrop";
const MINING_AIRDROP_ID = "mining_airdrop";
const FUND_CURRENCY_ID = "fund_currency";
const LABORATORY_CURRENCY_ID = "laboratory_currency";

const AIRDROP = [
    {
        "id": BIND_AIRDROP_ID,
        "name": "绑定 TBG 空投",
        "rate": BIND_AIRDROP / BASE_RATE,
    },
    {
        "id": TBG_1_AIRDROP_ID,
        "name": "参与 TBG-I 空投",
        "rate": TBG_1_AIRDROP / BASE_RATE,
    },
    {
        "id": CHECK_IN_AIRDROP_ID,
        "name": "签到空投",
        "rate": CHECK_IN_AIRDROP / BASE_RATE,
    },
    {
        "id": GAME_AIRDROP_ID,
        "name": "游戏空投",
        "rate": GAME_AIRDROP / BASE_RATE,
    },
    {
        "id": MINING_AIRDROP_ID,
        "name": "资产包挖矿",
        "rate": MINING_AIRDROP / BASE_RATE,
    },
    {
        "id": FUND_CURRENCY_ID,
        "name": "TBG 基金",
        "rate": FUND_CURRENCY / BASE_RATE,
    },
    {
        "id": LABORATORY_CURRENCY_ID,
        "name": "TBG 区块链实验室研发费用",
        "rate": LABORATORY_CURRENCY / BASE_RATE,
    }
];

/**
 * TBG发币规划
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "BIND_AIRDROP": BIND_AIRDROP,
    "TBG_1_AIRDROP": TBG_1_AIRDROP,
    "CHECK_IN_AIRDROP": CHECK_IN_AIRDROP,
    "GAME_AIRDROP": GAME_AIRDROP,
    "MINING_AIRDROP": MINING_AIRDROP,
    "FUND_CURRENCY": FUND_CURRENCY,
    "LABORATORY_CURRENCY": LABORATORY_CURRENCY,
    "GAME_AIRDROP_INCOME": GAME_AIRDROP_INCOME,
    "CHECK_IN_AIRDROP_1": CHECK_IN_AIRDROP_1,
    "CHECK_IN_AIRDROP_2": CHECK_IN_AIRDROP_2,
    "CHECK_IN_AIRDROP_3": CHECK_IN_AIRDROP_3,
    "CHECK_IN_AIRDROP_4": CHECK_IN_AIRDROP_4,
    "CHECK_IN_AIRDROP_5": CHECK_IN_AIRDROP_5,
    "CHECK_IN_AIRDROP_6": CHECK_IN_AIRDROP_6,
    "CHECK_IN_AIRDROP_7": CHECK_IN_AIRDROP_7,
    "AIRDROP": AIRDROP,
    "BIND_AIRDROP_ID": BIND_AIRDROP_ID,
    "TBG_1_AIRDROP_ID": TBG_1_AIRDROP_ID,
    "CHECK_IN_AIRDROP_ID": CHECK_IN_AIRDROP_ID,
    "GAME_AIRDROP_ID": GAME_AIRDROP_ID,
    "MINING_AIRDROP_ID": MINING_AIRDROP_ID,
    "FUND_CURRENCY_ID": FUND_CURRENCY_ID,
    "LABORATORY_CURRENCY_ID": LABORATORY_CURRENCY_ID,
    "BIND_MEMBER_LIMIT": BIND_MEMBER_LIMIT,
    "BIND_REFERRER_AIRDROP": BIND_REFERRER_AIRDROP,
    "BIND_ACCOUNT_AIRDROP": BIND_ACCOUNT_AIRDROP,
    "TBG_1_MEMBER_LIMIT": TBG_1_MEMBER_LIMIT,
    "TBG_1_REFERRER_AIRDROP": TBG_1_REFERRER_AIRDROP,
    "TBG_1_ACCOUNT_AIRDROP": TBG_1_ACCOUNT_AIRDROP,
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } BASE_RATE 
 * @property { number } BIND_AIRDROP 绑定 TBG 推荐关系即空投 30TBG，前 100,000 个 UE 账号
 * @property { number } TBG_1_AIRDROP  参与 TBG-I 即空投 150TBG，前 300,000 个UE账号，复投不再空投
 * @property { number } CHECK_IN_AIRDROP 每日签到空投
 * @property { number } GAME_AIRDROP  游戏空投
 * @property { number } MINING_AIRDROP  资产包挖矿
 * @property { number } FUND_CURRENCY  TBG基金，作为长期社区建设、管理等费用，逐步释放
 * @property { number } LABORATORY_CURRENCY  TBG区块链实验室，作为区块链技术研发费用，6年逐步释放
 * @property { number } GAME_AIRDROP_INCOME 游戏每投注 1 UE, TBG空投 0.05 TBG
 * @property { number } CHECK_IN_AIRDROP_1 每日签到奖励，奖励划入线性释放池
 * @property { number } CHECK_IN_AIRDROP_2 每日签到奖励，奖励划入线性释放池
 * @property { number } CHECK_IN_AIRDROP_3 每日签到奖励，奖励划入线性释放池
 * @property { number } CHECK_IN_AIRDROP_4 每日签到奖励，奖励划入线性释放池
 * @property { number } CHECK_IN_AIRDROP_5 每日签到奖励，奖励划入线性释放池
 * @property { number } CHECK_IN_AIRDROP_6 每日签到奖励，奖励划入线性释放池
 * @property { number } CHECK_IN_AIRDROP_7 每日签到奖励，奖励划入线性释放池
 * @property { Airdrop[] } AIRDROP
 * @property { string } BIND_AIRDROP_ID
 * @property { string } TBG_1_AIRDROP_ID
 * @property { string } CHECK_IN_AIRDROP_ID
 * @property { string } GAME_AIRDROP_ID
 * @property { string } MINING_AIRDROP_ID
 * @property { string } FUND_CURRENCY_ID
 * @property { string } LABORATORY_CURRENCY_ID
 * @property { number } BIND_MEMBER_LIMIT 前 100,000 个 UE 账号
 * @property { number } BIND_REFERRER_AIRDROP 推荐人空投 10
 * @property { number } BIND_ACCOUNT_AIRDROP 账户空投 20
 * @property { number } TBG_1_MEMBER_LIMIT  前 300,000 个 UE 账号
 * @property { number } TBG_1_REFERRER_AIRDROP  推荐人空投 50
 * @property { number } TBG_1_ACCOUNT_AIRDROP  账户空投 100
 */

 /**
 * @description 常量
 * @typedef { Object } Airdrop
 * @property { string } id  
 * @property { string } name 
 * @property { number } rate  
 */