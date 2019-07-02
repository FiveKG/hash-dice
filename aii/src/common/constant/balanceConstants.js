// @ts-check

const BASE_RATE = 100;

// 可提现比率
const WITHDRAW_ENABLE = 40;
// 复投比率
const REPEAT_CURRENCY = 40;
// 全球彩彩码比率
const LOTTO_CURRENCY = 10;
// 游戏筹码比率
const GAME_CURRENCY = 10;



/**
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "WITHDRAW_ENABLE": WITHDRAW_ENABLE,
    "REPEAT_CURRENCY": REPEAT_CURRENCY,
    "LOTTO_CURRENCY": LOTTO_CURRENCY,
    "GAME_CURRENCY": GAME_CURRENCY,
}

module.exports = CONSTANT

/**
 * @description 用户余额的分配比例常量
 * @typedef { Object } Constant
 * @property { Number } BASE_RATE
 * @property { Number } WITHDRAW_ENABLE // 可提现比率
 * @property { Number } REPEAT_CURRENCY // 复投比率
 * @property { Number } LOTTO_CURRENCY // 全球彩彩码比率
 * @property { Number } GAME_CURRENCY // 游戏筹码比率
 */