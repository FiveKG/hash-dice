// @ts-check

/***
 * 1. TBG 总计发行: 1,000,000,000.0000
 *  * 挖矿及空投: 80%
 *      * 绑定 TBG 推荐关系即空投 30TBG，前 100,000 个 UE 账号: 0.3%
 *      * 参与 TBG-II 即 3.5%，共 35,000,000 TBG，复投不再空投: 3.5%, 按阶段（按投资时间）
 *      * 每日签到空投: 0.2%
 *      * 游戏空投: 5%
 *      * 资产包挖矿: 75%
 *  * TBG基金，作为长期社区建设、管理等费用，逐步释放: 5%
 *  * TBG区块链实验室，作为区块链技术研发费用，6年逐步释放: 10%
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

/**
 * 0.3%，共 3,000,000 TBG
 * 绑定 TBG 推荐关系即空投 20 TBG
 * 直接推荐人空投 10 TBG
 * 限前 100,000 个账号
 * 48小时内未参与 TBG-II 即收回
 */ 
const BIND_AIRDROP = 0.3;
// 前 100,000 个 UE 账号
const BIND_MEMBER_LIMIT = 100000;
// 推荐人空投 10
const BIND_REFERRER_AIRDROP = 10;
// 账户空投 20
const BIND_ACCOUNT_AIRDROP = 20;

// 参与 TBG-II 按阶段（按投资时间)，复投不再空投
/**
 * 3.5%，共 35,000,000 TBG
 * 前 50,000 个账号参与 TBG-II 即空投
 */
const TBG_2_AIRDROP = 3.5;
// 前 50,000 个账号参与 TBG-II 即空投
const TBG_2_MEMBER_LIMIT = 50000;

// 每日签到空投
const CHECK_IN_AIRDROP = 0.2;
// 游戏空投
const GAME_AIRDROP = 5;

// 6%，共 60,000,000 TBG 平移专用空投
const MOVE_AIRDROP = 6

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

// 全球合伙人私募，推荐人可得的比例
const RAISE_REFERRER_AIRDROP = 10;

// 当私募所有拨出达 35,000,000 TBG 或余数不足以满足最低私募时，即中止私募
const RAISE_LIMIT = 35000000

// TBG 基金，作为长期社区建设、管理等费用，逐步释放
const FUND_CURRENCY = 5;
// TBG 区块链实验室，作为区块链技术研发费用，6年逐步释放
const LABORATORY_CURRENCY = 10;

const BIND_AIRDROP_ID = "bind";
const TBG_2_AIRDROP_ID = "tbg_2";
const CHECK_IN_AIRDROP_ID = "check_in";
const GAME_AIRDROP_ID = "game";
const MINING_AIRDROP_ID = "mining";
const FUND_CURRENCY_ID = "fund_currency";
const LABORATORY_CURRENCY_ID = "laboratory_currency";
const MOVE_AIRDROP_ID = "move_airdrop_id";

const AIRDROP = [
    {
        "id": BIND_AIRDROP_ID,
        "name": "绑定 TBG 空投",
        "rate": BIND_AIRDROP / BASE_RATE,
    },
    {
        "id": TBG_2_AIRDROP_ID,
        "name": "参与 TBG-II 空投",
        "rate": TBG_2_AIRDROP / BASE_RATE,
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
    },
    {
        "id": MOVE_AIRDROP_ID,
        "name": "平移空投",
        "rate": MOVE_AIRDROP / BASE_RATE,
    }
];

/**
 * TBG发币规划
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "BIND_AIRDROP": BIND_AIRDROP,
    "TBG_2_AIRDROP": TBG_2_AIRDROP,
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
    "TBG_2_AIRDROP_ID": TBG_2_AIRDROP_ID,
    "CHECK_IN_AIRDROP_ID": CHECK_IN_AIRDROP_ID,
    "GAME_AIRDROP_ID": GAME_AIRDROP_ID,
    "MINING_AIRDROP_ID": MINING_AIRDROP_ID,
    "FUND_CURRENCY_ID": FUND_CURRENCY_ID,
    "LABORATORY_CURRENCY_ID": LABORATORY_CURRENCY_ID,
    "BIND_MEMBER_LIMIT": BIND_MEMBER_LIMIT,
    "BIND_REFERRER_AIRDROP": BIND_REFERRER_AIRDROP,
    "BIND_ACCOUNT_AIRDROP": BIND_ACCOUNT_AIRDROP,
    "TBG_2_MEMBER_LIMIT": TBG_2_MEMBER_LIMIT,
    "RAISE_REFERRER_AIRDROP": RAISE_REFERRER_AIRDROP,
    "RAISE_LIMIT": RAISE_LIMIT,
    "MOVE_AIRDROP": MOVE_AIRDROP
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } BASE_RATE 
 * @property { number } BIND_AIRDROP 绑定 TBG 推荐关系空投
 * @property { number } TBG_2_AIRDROP  参与 TBG-II 即空投复投不再空投
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
 * @property { string } TBG_2_AIRDROP_ID
 * @property { string } CHECK_IN_AIRDROP_ID 签到空投
 * @property { string } GAME_AIRDROP_ID 游戏空投
 * @property { string } MINING_AIRDROP_ID 资产包挖矿
 * @property { string } FUND_CURRENCY_ID TBG 基金
 * @property { string } LABORATORY_CURRENCY_ID TBG 区块链实验室研发费用
 * @property { number } BIND_MEMBER_LIMIT 前 100,000 个 UE 账号
 * @property { number } BIND_REFERRER_AIRDROP 推荐人空投 10
 * @property { number } BIND_ACCOUNT_AIRDROP 账户空投 20
 * @property { number } TBG_2_MEMBER_LIMIT  前 50,000 个 UE 账号
 * @property { number } RAISE_REFERRER_AIRDROP 全球合伙人私募，推荐人可得的比例
 * @property { number } RAISE_LIMIT 私募限额
 * @property { number } MOVE_AIRDROP
 */

 /**
 * @description 常量
 * @typedef { Object } Airdrop
 * @property { string } id  
 * @property { string } name 
 * @property { number } rate  
 */