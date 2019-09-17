// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取所有期数及开奖信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const { GAME_STATE } = require("../../common/constant/gameConstants");
const df = require("date-fns");
const { pool } = require("../../db");

// 获取所有期数及开奖信息
async function gameSession(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const sql = `
            SELECT gs.periods, gs.gs_id, game.game_name, game.key_count, game.quantity
                FROM game_session gs 
                JOIN game ON game.g_id = gs.g_id 
                WHERE gs.g_id = $1 
                AND gs.game_state = $2
                ORDER BY gs.periods ASC 
        `
        const { rows: [ latestGameSession ] } = await pool.query(sql, [ reqData.game_id, GAME_STATE.START ]);
        if (!latestGameSession) {
            return res.send(get_status(1012, "game not exists"));
        }
        const selectBetOrder = `SELECT * FROM bet_order WHERE gs_id = $1`
        const { rows: betOrderList } = await pool.query(selectBetOrder, [ latestGameSession.gs_id ]);
        let betKey = 0;
        let lastKey = latestGameSession.key_count;
        if (betOrderList.length !== 0) {
            betKey = betOrderList.map(it => it.key_count).reduce((pre, curr) => pre + curr);
        }
        let resData = get_status(1);
        resData.data = {
            "game_name": latestGameSession.game_name,
            "periods": latestGameSession.periods,
            "bet_key": betKey,
            "total_key": latestGameSession.key_count,
            "last_key": lastKey - betKey,
            "quantity": new Decimal(latestGameSession.quantity).toNumber()
        }
        res.send(resData);
    } catch (err) {
        logger.error("request gameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSession;