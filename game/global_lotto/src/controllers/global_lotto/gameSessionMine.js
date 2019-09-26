// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取当前用户投注的信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const { pool } = require("../../db");
const { GAME_STATE } = require("../../common/constant/gameConstants");

// 获取当前用户投注的信息
async function gameSessionMine(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        // 先查出所有的期数
        const sql = `
            SELECT gs.periods, gs.reward_num, bo.create_time, gs.game_state, bo.key_count, a.win_type
                FROM game_session gs 
                JOIN bet_order bo ON gs.gs_id = bo.gs_id
                LEFT JOIN award_session a ON a.gs_id = gs.gs_id
                WHERE bo.account_name = $1
                ORDER BY create_time DESC
        `
        const { rows: myOrderList } = await pool.query(sql, [ reqData.account_name ]);
        logger.debug("myOrderList: ", myOrderList)
        let resData = get_status(1);
        resData.data = {
            detail: myOrderList.map(it => {
                // 如果游戏是开始状态或者是待开奖
                let winType = "sorry";
                if (it.game_state === GAME_STATE.START || it.game_state == GAME_STATE.REWARDING) {
                    winType = "waiting"
                } else {
                    if (it.win_type !== "sorry") {
                        winType = "bingo"
                    }
                }
                return {
                    periods: it.periods,
                    win_type: winType,
                    bet_key: it.key_count,
                    bet_time: it.create_time
                }
            })
        }
        res.send(resData);
    } catch (err) {
        logger.error("request gameSessionMine error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionMine;