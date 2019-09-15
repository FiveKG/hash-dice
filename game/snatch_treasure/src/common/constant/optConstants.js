// @ts-check

/***
 * 操作类型常量
 */

// 夺宝开奖
const SNATCH_OPEN = "snatch_open";

// 夺宝投注
const SNATCH_BET = "snatch_bet";

// 夺宝消息
const SNATCH_MQ = "snatch_mq";

// 开始新游戏
const START_NEW_GAME = 'start_new_game'

/**
 * TBG发币规划
 * @type { Constant }
 */
const CONSTANT = {
    "SNATCH_OPEN": SNATCH_OPEN,
    "SNATCH_MQ": SNATCH_MQ,
    "SNATCH_BET": SNATCH_BET,
    "START_NEW_GAME": START_NEW_GAME
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { string } SNATCH_OPEN 夺宝开奖
 * @property { string } SNATCH_MQ 夺宝开奖
 * @property { string } SNATCH_BET 夺宝消息
 * @property { string } START_NEW_GAME 开始新游戏
 */