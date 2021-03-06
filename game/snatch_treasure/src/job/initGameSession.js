// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "初始化游戏期数" });
const { Decimal } = require("decimal.js");
const { pool, psTrx } = require("../db");
const { SNATCH_TREASURE_CONTRACT, UE_TOKEN_SYMBOL } = require("../common/constant/eosConstants");
const { GAME_STATE, INIT_SESSION_COUNT, INIT_SESSION_LIMIT } = require("../common/constant/gameConstants");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, insertGameSession, getLastGameSession } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const df = require("date-fns");
const sleep = require("./sleep");

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
                for (let i = 0; i < INIT_SESSION_COUNT; i++) {
                    await sleep(20);
                    const now = new Date();
                    const opts = [ 
                        generate_primary_key(), oneGameInfo.g_id, SNATCH_TREASURE_CONTRACT, 
                        tmpPeriods, {}, GAME_STATE.START, "", df.format(now, "YYYY-MM-DDTHH:mm:ssZ")
                    ]
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
                            create_time: df.format(now, "YYYY-MM-DDTHH:mm:ss"),
                            rule: {
                                id: oneGameInfo.g_id,
                                quantity: `${ new Decimal(oneGameInfo.quantity).toFixed(4)} ${ UE_TOKEN_SYMBOL }`,
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
                for (let i = 0; i < sqlList.length; i++) {
                    await client.query(sqlList[i].sql, sqlList[i].values);
                }
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