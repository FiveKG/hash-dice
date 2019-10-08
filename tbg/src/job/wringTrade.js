// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "撮合交易" });
const { TRADE_ORDER_RATE, BUY_END_TIME, BUY_START_TIME, BASE_RATE } = require("../common/constant/tradeConstant");
const { TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants");
const {  SELL, BUY } = require("../common/constant/optConstants");
const { generate_primary_key } = require("../common/index.js");
const df = require("date-fns");
const { Decimal } = require("decimal.js");
const { scheduleJob } = require("node-schedule");
const buyAlloc = require("./buyAlloc");

logger.debug(`wringTrade running...`);
scheduleJob("0 */5 * * * *", wringTrade);

// wringTrade()

/***
 * 撮合交易，根据比例，每五分钟撮合一次，交易量不足时由平台插单
 */
async function wringTrade() {
    try {
        const now = new Date();
        const dayStart = df.startOfDay(now);
        const startTime = df.addHours(dayStart, BUY_START_TIME);
        const endTime = df.addHours(dayStart, BUY_END_TIME);
        const trxList = [];
        const actionList = [];
        const WAIT_STATE = "wait";
        const CREATE_STATE = "create";
        const FINISH_STATE = "finished";
        logger.debug("now: ", now);
        // 如果在不再交易时间内, 交易结束时，没有完成的订单全部撤销，资金原路退回
        if (!df.isWithinRange(now, startTime, endTime)) {
            logger.debug("!df.isWithinRange(now, startTime, endTime): ", !df.isWithinRange(now, startTime, endTime));
            const sql = `
                SELECT * FROM trade WHERE state = '${ WAIT_STATE }' OR state = '${ CREATE_STATE }' ORDER BY create_time DESC;
            `
            const updateTradeSql = `
                UPDATE trade SET state = $1, finished_time = $2, trx_amount = $3 WHERE id = $4
            `
            const insertTradeLogSql = `
                INSERT INTO trade_log(id, tr_id, trade_type, amount, memo, price, volume, create_time)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8);
            `
            const { rows: tradeInfo } = await pool.query(sql);
            if (tradeInfo.length === 0) {
                return;
            }
            // 交易结束时，未成交的买入订单, 由平台来撮合
            const buyOrder = tradeInfo.filter(it => it.trade_type !== BUY && it.state === WAIT_STATE);
            logger.debug("buyOrder: ", buyOrder);
            for (const info of buyOrder) {
                // 待成交数量
                const trxAmount = new Decimal(info.amount).minus(info.trx_amount);
                const { queryList: trxList, actionsList } = await buyAlloc({ ...info, tradeOpType: FINISH_STATE, trxAmount: trxAmount });
                trxList.push(...trxList);
                actionList.push(...actionsList);
            }

            // 交易结束时，未成交的卖单，撤销，资金原路退回
            const sellOrder = tradeInfo.filter(it => it.trade_type === SELL && it.state === WAIT_STATE);
            logger.debug("sellOrder: ", sellOrder);
            for (const info of sellOrder) {
                // 待成交数量
                const trxAmount = new Decimal(info.amount).minus(info.trx_amount);
                const tradeMemo = `trade close, pending transaction ${ trxAmount.toNumber() }, cancel trade order`;
                trxList.push({
                    sql: updateTradeSql,
                    values: [ "cancel", 'now()', 0, info.id ]
                });
                const logId = generate_primary_key();
                trxList.push({
                    sql: insertTradeLogSql,
                    values: [ logId, info.id, info.trade_type, info.amount, tradeMemo, info.price, info.amount * info.price, 'now()' ]
                });

                // 将未成交的资金退回用户账户中
                const trxMemo = `trade close at ${ df.format(new Date(), "YYYY-MM-DD HH:mm:ssZ") }, return pending transaction ${ trxAmount.toNumber() }`;
                actionList.push(
                    {
                        account: TBG_TOKEN_COIN,
                        name: "transfer",
                        authorization: [{
                            actor: TBG_TOKEN_COIN,
                            permission: 'active',
                        }],
                        data: {
                            from: TBG_FREE_POOL,
                            to: info.account_name,
                            quantity: `${ trxAmount.toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                            memo: trxMemo,
                        }
                    }
                )
            }

            // 新创建的订单，直接撤销, create 状态时用户未转账，直接关闭
            const newOrder = tradeInfo.filter(it => it.trade_type == CREATE_STATE);
            logger.debug("newOrder: ", newOrder);
            for (const info of newOrder) {
                const tradeTime = df.format(now, "YYYY-MM-DD HH:mm:ssZ");
                const tradeMemo = 'trade close, close trade order';
                trxList.push({
                    sql: updateTradeSql,
                    values: [ "close", tradeTime, 0, info.id ]
                });
                const logId = generate_primary_key();
                trxList.push({
                    sql: insertTradeLogSql,
                    values: [ logId, info.id, info.trade_type, info.amount, tradeMemo, info.price, info.amount * info.price, tradeTime ]
                });
            }
        } else {
            const sql = `
                SELECT * FROM trade ORDER BY create_time DESC;
            `
            const { rows: tradeInfo } = await pool.query(sql);
            const buyOrder = tradeInfo.filter(it => it.trade_type !== SELL && (it.state === FINISH_STATE || it.state === WAIT_STATE));
            const sellOrder = tradeInfo.filter(it => it.trade_type === SELL && (it.state === FINISH_STATE || it.state === WAIT_STATE));
            logger.debug("tradeInfo: ", tradeInfo);
            logger.debug("buyOrder: ", buyOrder);
            logger.debug("sellOrder: ", sellOrder);
            // 如果没有订单，不做处理
            if (tradeInfo.length === 0) {
                return;
            } else {
                const rate = new Decimal(TRADE_ORDER_RATE).div(BASE_RATE);
                // 如果没有买单, 不做处理
                if (buyOrder.length === 0) {
                    return;
                } else if (sellOrder.length === 0) {
                    // 如果没有卖单, 由平台来插单
                    const orderCount = Math.ceil(rate.mul(buyOrder.length).toNumber());
                    const waitOrder = buyOrder.filter(it => it.state === WAIT_STATE).splice(0, orderCount);
                    logger.debug("waitOrder: ", waitOrder);
                    const { actions, queryList } = await replenish(waitOrder);
                    actionList.push(...actions);
                    trxList.push(...queryList);
                } else {
                    const buyToSell = sellOrder.length / buyOrder.length;
                    // 当比例 < 30% 时
                    if (!rate.lessThan(buyToSell)) {
                        return;
                    } else {
                        const orderCount = Math.ceil(rate.minus(buyToSell).mul(buyOrder.length).toNumber());
                        const waitOrder = buyOrder.filter(it => it.state === WAIT_STATE).splice(0, orderCount);
                        logger.debug("waitOrder: ", waitOrder);
                        const { actions, queryList } = await replenish(waitOrder);
                        actionList.push(...actions);
                        trxList.push(...queryList);
                    }
                }
            }            
        }

        logger.debug("trxList: ", trxList);
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        await psTrx.pub(actionList);
    } catch (err) {
        logger.error("wring order error, the error stock is ", err);
        throw err;
    }
}

/**
 * 平台插单
 * @param { any[] } waitOrder
 */
async function replenish(waitOrder) {
    try {
        const queryList = [];
        const tmpActions = [];
        const now = df.format(new Date(), "YYYY-MM-DD HH:mm:ssZ");
        const updateTradeSql = `
            UPDATE trade SET state = $1, finished_time = $2, trx_amount = $3 WHERE id = $4
        `
        const insertTradeLogSql = `
            INSERT INTO trade_log(id, tr_id, trade_type, amount, memo, price, volume, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8);
        `
        const insertTradeSql = `
            INSERT INTO trade(id, account_name, trade_type, extra, amount, trx_amount, price, state, create_time, finished_time)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `
        for (const info of waitOrder) {
            const memo = `platform sell, trade done`
            // 记录平台插入的订单及日志
            const trId = generate_primary_key();
            queryList.push({
                sql: insertTradeSql,
                values: [ trId, TBG_TOKEN_COIN, info.trade_type, info.extra, info.amount, info.amount, info.price, "finished", 'now()', 'now()' ]
            });
            queryList.push({
                sql: insertTradeLogSql,
                values: [ generate_primary_key(), trId, info.trade_type, info.amount, memo, info.price, info.amount * info.price, 'now()' ]
            });

            // 待成交数量
            const trxAmount = new Decimal(info.amount).minus(info.trx_amount);
            const { queryList: trxList, actionsList } = await buyAlloc({ ...info, tradeOpType: "finished", trxAmount: trxAmount });
            queryList.push(...trxList);
            tmpActions.push(...actionsList);
        }

        const actions = waitOrder.map(it => {
            return {
                account: TBG_TOKEN_COIN,
                name: "transfer",
                authorization: [{
                    actor: TBG_TOKEN_COIN,
                    permission: 'active',
                }],
                data: {
                    from: TBG_TOKEN_COIN,
                    to: TBG_FREE_POOL,
                    quantity: `${ new Decimal(it.amount).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: `${ df.format(it.create_time, "YYYY-MM-DD HH:mm:ssZ") } platform replenish order`
                }
            }
        });

        tmpActions.push(...actions)
        return {
            actions: tmpActions,
            queryList
        }
    } catch (err) {
        logger.error("platform replenish order error, the error stock is ", err);
        throw err;
    }
}

module.exports = wringTrade;