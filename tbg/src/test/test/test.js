// @ts-check
const BASE_RATE = 100;

// 绑定 TBG 推荐关系即空投 30TBG，前 100,000 个 UE 账号
const BIND_AIRDROP = 0.3;
// 参与 TBG-I 即空投 150TBG，前 300,000 个UE账号，复投不再空投
const TBG_1_AIRDROP = 4.5;
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

const AIRDROP = [
    {
        "id": "bind_airdrop",
        "name": "绑定 TBG 空投",
        "rate": BIND_AIRDROP / BASE_RATE,
    },
    {
        "id": "tbg_1_airdrop",
        "name": "参与 TBG-I 空投",
        "rate": TBG_1_AIRDROP / BASE_RATE,
    },
    {
        "id": "check_in_airdrop",
        "name": "签到空投",
        "rate": CHECK_IN_AIRDROP / BASE_RATE,
    },
    {
        "id": "game_airdrop",
        "name": "游戏空投",
        "rate": GAME_AIRDROP / BASE_RATE,
    },
    {
        "id": "mining_airdrop",
        "name": "资产包挖矿",
        "rate": MINING_AIRDROP / BASE_RATE,
    },
    {
        "id": "fund_currency",
        "name": "TBG 基金",
        "rate": FUND_CURRENCY / BASE_RATE,
    },
    {
        "id": "laboratory_currency",
        "name": "TBG 区块链实验室研发费用",
        "rate": LABORATORY_CURRENCY / BASE_RATE,
    }
];

(async () => {
    const res = AIRDROP.find(it => it.id === "laboratory_currency");
    console.debug("res: ", res);
})();