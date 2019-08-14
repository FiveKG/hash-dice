// @ts-check

/**
 * 每天从0:00开始累计，
 * 卖单总和=已成交卖单+待成交卖单，
 * 买单总和=已成交买单+待成交买单，
 * 计算卖单买单比例=卖单总和/买单总和，
 * 当比例<30%时，由系统下卖单补至30%，
 * 当比例>=30%时，系统不下卖单，系统每5分钟进行统计后下单
 */

// 账号首次买入开放时间
const FIRST_BUY = 9;
// 买入 TBG 交易开放时间
const BUY_START_TIME = 10;
const BUY_END_TIME = 21;
// 卖出 TBG 交易开放时间
const SELL_START_TIME = 10;
const SELL_END_TIME = 21;

const BASE_RATE = 100;
// 手续费
const SELL_FEE = 20;
// 线性释放池中销毁比例
const DESTROY = 0.61;
// 卖单买单比例
const TRADE_ORDER_RATE = 30;

// TBG 拟定开盘价 1.0000 0000 UE
const OPENING_PRICE = 1;
// TBG每日价格上涨, 每日随机上涨 0.005 - 0.015 UE
const MIN_RAISE_PRICE = 0.005;
const MAX_RAISE_PRICE = 0.015;
// 私募单价 当前单价的 50%
const RAISE_PRICE = 50;

// 开盘价 redis key
const OPENING_PRICE_KEY = `tbg:tbg_opening_price`

/**
 * TBG交易开放时间
 * 在交易开放时间结束时，未成交订单由系统自动撤单
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_RATE": BASE_RATE,
    "FIRST_BUY": FIRST_BUY,
    "BUY_START_TIME": BUY_START_TIME,
    "BUY_END_TIME": BUY_END_TIME,
    "SELL_START_TIME": SELL_START_TIME,
    "SELL_END_TIME": SELL_END_TIME,
    "SELL_FEE": SELL_FEE,
    "DESTROY": DESTROY,
    "TRADE_ORDER_RATE": TRADE_ORDER_RATE,
    "OPENING_PRICE": OPENING_PRICE,
    "MIN_RAISE_PRICE":MIN_RAISE_PRICE,
    "MAX_RAISE_PRICE":MAX_RAISE_PRICE,
    "RAISE_PRICE":RAISE_PRICE,
    "OPENING_PRICE_KEY": OPENING_PRICE_KEY
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { number } BASE_RATE 
 * @property { number } FIRST_BUY 账号首次买入
 * @property { number } BUY_START_TIME 买入 TBG 交易开放时间
 * @property { number } BUY_END_TIME  买入 TBG 交易开放时间
 * @property { number } SELL_START_TIME 卖出 TBG 交易开放时间
 * @property { number } SELL_END_TIME  卖出 TBG 交易开放时间
 * @property { number } SELL_FEE  手续费
 * @property { number } DESTROY 线性释放池中销毁比例
 * @property { number } TRADE_ORDER_RATE 卖单买单比例
 * @property { number } OPENING_PRICE TBG 拟定开盘价 1.0000 0000 UE
 * @property { number } MIN_RAISE_PRICE TBG每日价格上涨最小额度
 * @property { number } MAX_RAISE_PRICE TBG每日价格上涨最大额度
 * @property { number } RAISE_PRICE  私募单价 当前单价的 50%
 * @property { string } OPENING_PRICE_KEY 开盘价 redis key
 */