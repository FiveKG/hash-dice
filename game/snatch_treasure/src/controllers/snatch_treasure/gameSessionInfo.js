// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取所有期数及开奖信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const { GAME_STATE } = require("../../common/constant/gameConstants");
const df = require("date-fns");
const { pool } = require("../../db");

// 获取所有期数及开奖信息
async function gameSessionInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const latestGameSession = await getLatestGameSession(reqData.game_id);
        if (!latestGameSession) {
            return res.send(get_status(1012, "game not exists"));
        }
        const selectAwardSql = `
            SELECT gs.periods, gs.gs_id, gs.reward_code 
                FROM game_session gs 
                WHERE gs.g_id = $1 
                AND gs.periods <= $2 
                ORDER BY periods DESC
        `
        const { rows: awardList } = await pool.query(selectAwardSql, [ reqData.game_id, latestGameSession.periods ]);
        let resData = get_status(1);
        resData.data = {
            "detail": awardList.map(it => {
                let awardCode = "000000";
                if (it.periods === latestGameSession.periods) {
                    awardCode = "000000";
                } else {
                    awardCode = it.reward_code;
                }

                return {
                    "periods": it.periods,
                    "reward_code": awardCode
                }
            })
        }
        res.send(resData);
    } catch (err) {
        logger.error("request latestGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionInfo;