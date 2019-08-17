// @ts-check

/***
 * 操作类型常量
 */

// 提现
const WITHDRAW = "withdraw";

const INVESTMENT = "investment";

// 私募
const RAISE = 'raise';

// 释放
const RELEASE = 'release';

// 转出
const BUY = 'buy';

// 买入
const SELL = 'sell';

// 挖矿推荐收益
const MINING_REFERRER = 'mining_referrer';

// 首次购买推荐收益
const FIRST_BUY = 'first_buy';

// 卖出销毁
const DESTROY = 'destroy';

// 绑定
const BIND = 'bind';

// 参与 TBG-I
const TBG_1 = 'tbg_1';

// 挖矿
const MINING = 'mining';

// 游戏
const GAME = 'game';

// 游戏推荐奖金
const GAME_INVITE = 'game_invite'

// 签到
const CHECK_IN = 'check_in';

// 直接推荐
const INVITE = "invite";

// Bingo 奖金
const BINGO = "bingo";

// 直接推荐PK奖金
const PK = "pk";

// 三倍收益保障金
const PROTECTION = "protection";

// 股东池分红
const HOLDER = "holder";

// 一行公排收益
const SORT = "sort";

// 三三公排收益
const MODE = "mode";

// 复投
const REPEAT = "repeat"


const OPT_TYPE = {
    "RAISE": {
        "NAME": "私募",
        "ID": RAISE
    },
    "RELEASE": {
        "NAME": "释放",
        "ID": RELEASE
    },
    "BUY": {
        "NAME": "转出",
        "ID": BUY
    },
    "SELL": {
        "NAME": "买入",
        "ID": SELL
    },
    "MINING_REFERRER": {
        "NAME": "挖矿推荐收益",
        "ID": MINING_REFERRER
    },
    "FIRST_BUY": {
        "NAME": "首次购买推荐收益",
        "ID": FIRST_BUY
    },
    "DESTROY": {
        "NAME": "卖出销毁",
        "ID": DESTROY
    },
    "BIND": {
        "NAME": "绑定",
        "ID": BIND
    },
    "TBG_1": {
        "NAME": "参与 TBG-I",
        "ID": TBG_1
    },
    "MINING": {
        "NAME": "挖矿",
        "ID": MINING
    },
    "GAME": {
        "NAME": "游戏",
        "ID": GAME
    },
    "GAME_INVITE": {
        "NAME": "游戏邀请",
        "ID": GAME_INVITE
    },
    "CHECK_IN": {
        "NAME": "签到",
        "ID": CHECK_IN
    },
    "INVITE": {
        "NAME": "直接推荐",
        "ID": INVITE
    },
    "BINGO": {
        "NAME": "奖金",
        "ID": BINGO
    },
    "PK": {
        "NAME": "直接推荐 PK 奖金",
        "ID": PK
    },
    "PROTECTION": {
        "NAME": "三倍收益保障金",
        "ID": PROTECTION
    },
    "HOLDER": {
        "NAME": "股东池分红",
        "ID": HOLDER
    },
    "SORT": {
        "NAME": "一行公排收益",
        "ID": SORT
    },
    "MODE": {
        "NAME": "三三公排收益",
        "ID": MODE
    },
    "REPEAT": {
        "NAME": "复投",
        "ID": REPEAT
    }
}

/**
 * TBG发币规划
 * @type { Constant }
 */
const CONSTANT = {
    "WITHDRAW": WITHDRAW,
    "INVESTMENT": INVESTMENT,
    "RAISE": RAISE,
    "RELEASE": RELEASE,
    "BUY": BUY,
    "SELL": SELL,
    "MINING_REFERRER": MINING_REFERRER,
    "FIRST_BUY": FIRST_BUY,
    "DESTROY": DESTROY,
    "BIND": BIND,
    "TBG_1": TBG_1,
    "MINING": MINING,
    "GAME": GAME,
    "GAME_INVITE": GAME_INVITE,
    "CHECK_IN": CHECK_IN,
    "INVITE": INVITE,
    "BINGO": BINGO,
    "PK": PK,
    "PROTECTION": PROTECTION,
    "HOLDER": HOLDER,
    "SORT": SORT,
    "MODE": MODE,
    "REPEAT": REPEAT,
    "OPT_TYPE": OPT_TYPE
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { string } WITHDRAW 提现
 * @property { string } INVESTMENT
 * @property { string } RAISE 私募
 * @property { string } RELEASE 释放
 * @property { string } BUY 转出
 * @property { string } SELL 买入
 * @property { string } MINING_REFERRER 挖矿推荐收益
 * @property { string } FIRST_BUY 首次购买推荐收益
 * @property { string } DESTROY 卖出销毁
 * @property { string } BIND 绑定
 * @property { string } TBG_1 参与 TBG-I
 * @property { string } MINING 挖矿
 * @property { string } GAME 游戏
 * @property { string } GAME_INVITE 游戏邀请
 * @property { string } CHECK_IN 签到
 * @property { string } INVITE 直接推荐
 * @property { string } BINGO Bingo 奖金
 * @property { string } PK 直接推荐PK奖金
 * @property { string } PROTECTION 三倍收益保障金
 * @property { string } HOLDER 股东池分红
 * @property { string } SORT 一行公排收益
 * @property { string } MODE 三三公排收益
 * @property { string } REPEAT 复投
 * @property {{ [x: string]: { ID: string, NAME: string } }} OPT_TYPE
 */