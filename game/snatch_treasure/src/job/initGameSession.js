// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "初始化游戏期数" });
const { Decimal } = require("decimal.js");
const { pool, psTrx } = require("../db");
const { SNATCH_TREASURE_CONTRACT } = require("../common/constant/eosConstants");
const { GAME_STATE, INIT_SESSION_COUNT, INIT_SESSION_LIMIT } = require("../common/constant/gameConstants");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, insertGameSession, getLastGameSession } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");

/**
 * 第一次初始化
 */
async function begin(){
    try {
        const selectGameSession = `SELECT count(1) FROM game_session`;
        const { rows: [ { count } ] } = await pool.query(selectGameSession);
        if (count === "0") {
            for (let i = 1; i < 4; i++) {
                const gIdKey = `snatch_treasure:g_id:${ i }`;
                const total = await redis.get(gIdKey);
                if (!total) {
                    await redis.set(gIdKey, 0);
                }
                await initGameSession(i, 1);
            }
        }
    } catch (err) {
        throw err;
    }
}

/**
 * 初始化游戏期数
 * @param { number } g_id
 * @param { number } periods
 */
async function initGameSession(g_id, periods) {
    try {
        // 记录区块链相关调用信息
        const actList = [];
        const sqlList = [];
        // 所有游戏种类
        const gameInfo = await getGameInfo();
        const oneGameInfo = gameInfo.find(it => it.g_id === g_id);
        // 如果找不到，直接返回
        if (!oneGameInfo) {
            return;
        }
        const insertToGameSessionSql = `
            INSERT INTO game_session(gs_id,g_id,creator,periods,extra,game_state,reward_code,create_time) 
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `

        // 查出大于单前期数未开始的游戏数量，如果低于某个比例，就初始化新的期数
        const gIdKey = `snatch_treasure:g_id:${ g_id }`;
        const total = await redis.get(gIdKey);
        if (!!total) {
            if (new Decimal(total).div(periods).lessThan(INIT_SESSION_LIMIT)) {
                let tmpPeriods = periods;
                // 游戏状态
                let state = 0;
                for (let i = 0; i < INIT_SESSION_COUNT; i++) {
                    // if (tmpPeriods === 1) {
                    //     state = GAME_STATE.START;
                    //     // 调用 snatch 合约设置游戏状态
                    //     actList.push({
                    //         account: SNATCH_TREASURE_CONTRACT,
                    //         name: "setstate",
                    //         authorization: [{
                    //             actor: SNATCH_TREASURE_CONTRACT,
                    //             permission: 'active',
                    //         }],
                    //         data: {
                    //             game_id: tmpPeriods,
                    //             state: state,
                    //             rule: oneGameInfo
                    //         }
                    //     });
                    //     tmpPeriods = Number(total) + 1
                    // } else {
                    //     state = GAME_STATE.INIT;
                    // }
                    const opts = [ generate_primary_key(), oneGameInfo.g_id, SNATCH_TREASURE_CONTRACT, tmpPeriods, {}, GAME_STATE.START, "", "now()" ]
                    sqlList.push({ sql: insertToGameSessionSql, values: opts });
                    // 调用 snatch 合约初始化期数
                    actList.push({
                        account: SNATCH_TREASURE_CONTRACT,
                        name: "init",
                        authorization: [{
                            actor: SNATCH_TREASURE_CONTRACT,
                            permission: 'active',
                        }],
                        data: {
                            game_id: tmpPeriods,
                            create_time: new Date(),
                            rule: {
                                id: oneGameInfo.g_id,
                                quantity: oneGameInfo.quantity,
                                key: oneGameInfo.key_count
                            }
                        }
                    });
                    tmpPeriods = tmpPeriods + 1;
                    // logger.debug("tmpPeriods: ", tmpPeriods);
                }

                await redis.set(gIdKey, Number(total) + INIT_SESSION_COUNT);
            } else {
                return;
            }

            let flag = false;
            const client = await pool.connect();
            try {
                await client.query("BEGIN");
                await Promise.all(sqlList.map(it => {
                    client.query(it.sql, it.values)
                }));
                await client.query("COMMIT");
                flag = true;
            } catch (err) {
                await client.query("ROLLBACK");
                throw err;
            } finally {
                await client.release();
            }

            if (flag && actList.length !== 0) {
                await psTrx.pub(actList);
            }
        }        
    } catch (err) {
        logger.error("initGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = {
    firstInit: begin,
    initGameSession
}