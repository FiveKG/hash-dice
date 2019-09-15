// @ts-check

// 游戏状态
const GAME_STATE = {
    "INIT": 0,
    "START": 1,
    "REWARDING": 2,
    "AWARDED": 3
};

// 开奖号码的位数
const OPEN_CODE_COUNT = 9;

// 每次初始化游戏期数
const INIT_SESSION_COUNT = 100;
// 当单前投注的期数与总期数比值低于这个值时，初始化游戏
const INIT_SESSION_LIMIT = 30;

/**
 * @type { Constant }
 */
const CONSTANT = {
    "GAME_STATE": GAME_STATE,
    "OPEN_CODE_COUNT": OPEN_CODE_COUNT,
    "INIT_SESSION_COUNT": INIT_SESSION_COUNT,
    "INIT_SESSION_LIMIT": INIT_SESSION_LIMIT
}

module.exports = CONSTANT

/**
 * @description 
 * @typedef { Object } Constant
 * @property {{ "INIT": number, "START": number, "REWARDING": number, "AWARDED": number }} GAME_STATE 游戏状态
 * @property { number } OPEN_CODE_COUNT 开奖号码的位数
 * @property { number } INIT_SESSION_COUNT 每次初始化游戏期数
 * @property { number } INIT_SESSION_LIMIT 当单前投注的期数与总期数比值低于这个值时，初始化游戏
 */