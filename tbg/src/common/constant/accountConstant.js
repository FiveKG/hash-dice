// @ts-check

// 最上层帐号
const TOP_ACCOUNT = [
    "system"
]

// 五倍收益保障池的帐号
const SAFE_POOL = "safePool";
// 三三静态的帐号
const MODE_POOL = "modePool";
// 一行公排的帐号
const SORT_POOL = "sortPool";
//  pk 奖池的帐号
const PK_POOL = "pkPool";
//  bingo 奖池的帐号
const BINGO_POOL = "bingoPool";
// 股东分红奖池帐号
const SHAREHOLDERS_POOL = "shareholdersPool";
// 社区帐号
const COMMUNITY_POOL = "communityPool";
// 开发维护的帐号
const DEV_OP_POOL = "devOpPool";

// 账号类型
const ACCOUNT_TYPE = {
    "GENERAL": "general", // 普通用户
    "GLOBAL": "global"  // 全球合伙人
}

// 随机邀请码
const INVITE_CODE = {
    "GENERAL": "000000", // 普通用户随机邀请码
    "GLOBAL": "W00000"  // 全球合伙人随机邀请码
}

// 邀请码 redis key
const INVITE_CODE_KEY = {
    "GENERAL": "tbg:generalInviteCode", // 普通用户邀请码 redis key
    "GLOBAL": "tbg:globalInviteCode"  // 全球合伙人邀请码 redis key
}

// 账号参与 tbg1
const ACCOUNT_ACTIVATED_TBG_1 = 10;

// 账号参与 tbg2
const ACCOUNT_ACTIVATED_TBG_2 = 20;

// 账号参与 tbg1 和 tbg2
const ACCOUNT_ACTIVATED_TBG_1_AND_2 = 30;

// 账号未激活
const ACCOUNT_INACTIVATED = 0

/**
 * EOS 帐号约定字符
 * @type { String[] } 
 */
const EOS_NAME_CONVENTIONS_CHAR = [
    '1', '2', '3', '4', '5', '.',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
];

/**
 * @type { Constant }
 */
const CONSTANT = {
    "SAFE_POOL": SAFE_POOL,
    "MODE_POOL": MODE_POOL,
    "SORT_POOL": SORT_POOL,
    "PK_POOL": PK_POOL,
    "BINGO_POOL": BINGO_POOL,
    "SHAREHOLDERS_POOL": SHAREHOLDERS_POOL,
    "COMMUNITY_POOL": COMMUNITY_POOL,
    "DEV_OP_POOL": DEV_OP_POOL,
    "EOS_NAME_CONVENTIONS_CHAR": EOS_NAME_CONVENTIONS_CHAR,
    "TOP_ACCOUNT": TOP_ACCOUNT,
    "ACCOUNT_ACTIVATED_TBG_1": ACCOUNT_ACTIVATED_TBG_1,
    "ACCOUNT_ACTIVATED_TBG_2": ACCOUNT_ACTIVATED_TBG_2,
    "ACCOUNT_ACTIVATED_TBG_1_AND_2": ACCOUNT_ACTIVATED_TBG_1_AND_2,
    "ACCOUNT_INACTIVATED": ACCOUNT_INACTIVATED,
    "ACCOUNT_TYPE": ACCOUNT_TYPE,
    "INVITE_CODE": INVITE_CODE,
    "INVITE_CODE_KEY": INVITE_CODE_KEY
}

module.exports = CONSTANT

/**
 * @description 系统帐号常量
 * @typedef { Object } Constant
 * @property { String } SAFE_POOL 五倍收益保障池的帐号
 * @property { String } MODE_POOL 三三静态的帐号
 * @property { String } SORT_POOL 一行公排的帐号
 * @property { String } PK_POOL  pk 奖池的帐号
 * @property { String } BINGO_POOL  bingo 奖池的帐号
 * @property { String } SHAREHOLDERS_POOL 股东分红奖池帐号
 * @property { String } COMMUNITY_POOL 社区帐号
 * @property { String } DEV_OP_POOL 开发维护的帐号
 * @property { String[] } EOS_NAME_CONVENTIONS_CHAR EOS 帐号约定字符
 * @property { Array<String> } TOP_ACCOUNT 最上层帐号
 * @property { number } ACCOUNT_ACTIVATED_TBG_1 账号参与 tbg1
 * @property { number } ACCOUNT_ACTIVATED_TBG_2 账号参与 tbg2
 * @property { number } ACCOUNT_ACTIVATED_TBG_1_AND_2 账号参与 tbg1 和 tbg2
 * @property { number } ACCOUNT_INACTIVATED 账号未激活
 * @property {{ GENERAL: string, GLOBAL: string }} ACCOUNT_TYPE 账号类型
 * @property {{ GENERAL: string, GLOBAL: string }} INVITE_CODE 随机邀请码
 * @property {{ GENERAL: string, GLOBAL: string }} INVITE_CODE_KEY 邀请码 redis key
 */