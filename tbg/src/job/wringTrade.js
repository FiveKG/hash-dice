// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/wringTrade.js": "撮合交易" });
const { TRADE_ORDER_RATE, BUY_END_TIME, BUY_START_TIME, BASE_RATE } = require("../common/constant/tradeConstant");
const { TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants");
const {  SELL } = require("../common/constant/optConstants");
const { generate_primary_key } = require("../common/index.js");
const df = require("date-fns");
const { Decimal } = require("decimal.js");
const { scheduleJob } = require("node-schedule");
const buyAirdrop = require("./buyAirdrop.js");

logger.debug(`wringTrade running...`);
scheduleJob("* */5 * * * *", wringTrade);

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
        // 如果在不再交易时间内, 交易结束时，没有完成的订单全部撤销，资金原路退回
        if (!df.isWithinRange(now, startTime, endTime)) {
            const sql = `
                SELECT * FROM trade WHERE state = 'wait' OR state = 'create' ORDER BY create_time DESC;
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
            for (const info of tradeInfo) {
                trxList.push({
                    sql: updateTradeSql,
                    values: [ "cancel", info.trade_type, now, info.id ]
                })
                trxList.push({
                    sql: insertTradeLogSql,
                    values: [ generate_primary_key(), info.id, info.trade_type, info.amount, 'trade close, cancel trade order', info.price, info.amount * info.price, df.format(now, "YYYY-MM-DD : HH:mm:ssZ") ]
                });
            }
        } else {
            const sql = `
                SELECT * FROM trade ORDER BY create_time DESC;
            `
            const { rows: tradeInfo } = await pool.query(sql);
            const buyOrder = tradeInfo.filter(it => it.trade_type !== SELL && (it.state === "finished" || it.state === "wait"));
            const sellOrder = tradeInfo.filter(it => it.trade_type === SELL && (it.state === "finished" || it.state === "wait"));
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
                    const waitOrder = buyOrder.filter(it => it.state === "wait").splice(0, orderCount);
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
                        const waitOrder = buyOrder.filter(it => it.state === "wait").splice(0, orderCount);
                        const { actions, queryList } = await replenish(waitOrder);
                        actionList.push(...actions);
                        trxList.push(...queryList);
                    }
                }
            }            
        }

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

        await psTrx.pub(actionList)
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
        const now = df.format(new Date(), "YYYY-MM-DD : HH:mm:ssZ");
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
                values: [ trId, TBG_TOKEN_COIN, info.trade_type, info.extra, info.amount, info.amount, info.price, "finished", now, now ]
            });
            queryList.push({
                sql: insertTradeLogSql,
                values: [ generate_primary_key(), trId, info.trade_type, info.amount, memo, info.price, info.amount * info.price, now ]
            });
            // 修改用户的订单并记录日志
            queryList.push({
                sql: updateTradeSql,
                values: [ "finished", now, info.amount, info.id ]
            })
            queryList.push({
                sql: insertTradeLogSql,
                values: [ generate_primary_key(), info.id, info.trade_type, info.amount, memo, info.price, info.amount * info.price, now ]
            });
            const { queryList: trxList, actionsList } = await buyAirdrop(info);
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
                    memo: `${ df.format(it.create_time, "YYYY-MM-DD : HH:mm:ssZ") } platform replenish order`
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