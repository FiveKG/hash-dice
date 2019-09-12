// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/global_lotto/gameSessionMineDetail.js": "获取当前用户某一期投注的详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const { pool } = require("../../db");
const { GAME_STATE } = require("../../common/constant/gameConstants");

// 获取当前用户某一期投注的详情
async function gameSessionMineDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        // 先查出所有的期数
        const sql = `
            SELECT gs.periods, gs.reward_num, bo.create_time, aw.win_type, gs.game_state
                FROM game_session gs 
                JOIN bet_order bo ON gs.gs_id = bo.gs_id
                JOIN award_session aw ON gs.gs_id = aw.gs_id
                WHERE bo.account_name = $1
        `
        const { rows: mineOrderList } = await pool.query(sql, [ reqData.account_name ]);
        let resData = get_status(1);
        resData.data = {
            detail: mineOrderList.map(it => {
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
                    reward_num: it.reward_num,
                    bet_time: it.create_time
                }
            })
        }
        res.send(resData);
    } catch (err) {
        logger.error("request gameSessionMineDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionMineDetail;