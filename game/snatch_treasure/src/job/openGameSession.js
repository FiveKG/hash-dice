// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "游戏开奖" });
const { Decimal } = require("decimal.js");
const { pool, psTrx } = require("../db");
const { xhr } = require("../common");
const { SNATCH_TREASURE_CONTRACT } = require("../common/constant/eosConstants");
const { OPEN_CODE_COUNT, GAME_STATE } = require("../common/constant/gameConstants");
const ALLOC_CONSTANTS = require("../common/constant/allocateRate");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const { rpc } = require("./getTrxAction");
const url = require("url");
const df = require("date-fns");
const { initGameSession } = require("./initGameSession");
const { accReward, getOpenResult } = require("./getOpenResult");
const allocBonus = require("./allocBonus");

/**
 * 游戏开奖
 * @param {{ g_id: number, periods: number, transaction_id: string }} data
 */
async function openGameSession(data) {
    try {
        /**
         * 1. 统计用户的中奖情况
         * 2. 判断用户的投注类型, 根据投注类型相应的退还,发放奖金
         * 3. 记录开奖信息
         */
        const sqlList = [];
        // 记录区块链相关调用信息
        const actList = [];
        
        // 所有游戏种类
        const gameInfo = await getGameInfo();
        const oneGameInfo = gameInfo.find(it => it.g_id === data.g_id);
        // 如果找不到，直接返回
        if (!oneGameInfo) {
            return;
        }

        // 获取游戏期数详情
        const selectGameSessionSql = `SELECT * FROM game_session WHERE g_id = $1 AND periods = $2`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSessionSql, [ oneGameInfo.g_id, data.periods ]);
        // 如果找不到，或者这一期的状态不是开始状态, 不可投注, 直接返回
        if (!gameSessionInfo || (!!gameSessionInfo && gameSessionInfo.game_state !== GAME_STATE.START)) {
            logger.debug(`${ data.periods } periods game can't not open`);
            return;
        }

        const baseNum = 100001;
        // 匹配哈希值中的数字
        const hashNum = data.transaction_id.match(/[\d]+/g);
        // @ts-ignore
        // 从匹配结果中截取后六位
        const mantissa = hashNum.join("").slice(-6) || baseNum;
        // @ts-ignore
        // 幸运数字 = ((本期最后一位投注者的交易 ID去字母取末 6 位数字 + 当期期数) / 所需 Key 数量 ) 的余数 + 100001
        const openCode = (( Number(mantissa) + data.periods) % oneGameInfo.key_count) + baseNum;

        // 查找这一期的投注记录
        const selectBetOrder = `SELECT * FROM bet_order WHERE gs_id = $1`
        const { rows: betOrderList } = await pool.query(selectBetOrder, [ gameSessionInfo.gs_id ]);
        // 如果没有这一期投注记录,直接记录开奖信息即可
        if (betOrderList.length === 0) {
            return;
        }
        const updateBetOrderSql = `
            UPDATE bet_order 
                SET bonus_code = $1, bonus_amount = $2  
                WHERE gs_id = $3 AND account_name = $4
        `

        // 遍历投注记录
        for (const info of betOrderList) {
            const betCode = info.bet_code.split(",");
            // 中奖金额
            let bonusAmount = new Decimal(0);
            // 判断是否中奖
            if (betCode.indexOf(openCode.toString()) > 0) {
                bonusAmount = new Decimal(ALLOC_CONSTANTS.ALLOC_TO_SNATCH_PRIZE_POOL).div(ALLOC_CONSTANTS.BASE_RATE).mul(oneGameInfo.prize_pool);
            }
            sqlList.push({
                sql: updateBetOrderSql,
                values: [ openCode.toString(), bonusAmount, info.gs_id, info.account_name ]
            })
        }

        // 修改游戏状态为已开奖
        const updateGameSession = `
            UPDATE game_session 
                SET game_state = $1, reward_code = $2
                WHERE gs_id = $3
        `
        sqlList.push({
            sql: updateGameSession,
            values: [ GAME_STATE.AWARDED, openCode.toString(), gameSessionInfo.gs_id ]
        })

        // 调用 snatch 合约开奖，记录相关信息
        actList.push({
            account: SNATCH_TREASURE_CONTRACT,
            name: "open",
            authorization: [{
                actor: SNATCH_TREASURE_CONTRACT,
                permission: 'active',
            }],
            data: {
                lucky_code: openCode.toString(),
                game_id: data.periods,
                reward_time: new Date(),
                rule: {
                    id: oneGameInfo.g_id,
                    quantity: oneGameInfo.quantity,
                    key: oneGameInfo.key_count
                }
            }
        });

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

        // 每次都调用一下初始化
        await initGameSession(data.g_id, data.periods);
    } catch (err) {
        logger.debug("award err: ", err);
    }
}


module.exports = openGameSession