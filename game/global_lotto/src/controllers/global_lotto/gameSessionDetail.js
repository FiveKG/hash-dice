// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/global_lotto/gameSessionDetail.js": "获取某一期开奖详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const { pool } = require("../../db");
const { GAME_STATE } = require("../../common/constant/gameConstants");
const { getLatestGameSession, getGameInfo } = require("../../models/game");


// 获取某一期开奖详情
async function gameSessionDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const gameInfo = await getGameInfo();;
        
        const selectGameSession = `SELECT periods, reward_num, game_state FROM game_session WHERE periods = $1`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSession, [ reqData.periods ]);

        // 如果游戏是开始状态或者是待开奖
        let rewardNum = gameSessionInfo.reward_num;
        if (gameSessionInfo.game_state === GAME_STATE.START || gameSessionInfo.game_state == GAME_STATE.REWARDING) {
            rewardNum = gameSessionInfo.reward_num;
            let resData = get_status(1);
            resData.data = {
                "gs_id": gameSessionInfo.gs_id,
                "count_down": df.differenceInSeconds(new Date(), gameSessionInfo.end_time),
                "reward_time": gameSessionInfo.reward_time,
                "prize_pool": new Decimal(gameInfo.prize_pool).toFixed(4)
            }
            
            res.send(resData);
        } else {
            // 查出投注记录
            const selectBetOrder = `SELECT bet_key, bet_amount, create_time, extra FROM bet_order WHERE account_name = $1 AND gs_id = $2`
            const { rows: [ betOrder ] } = await pool.query(selectBetOrder, [ reqData.account_name, gameSessionInfo.gs_id ]);
            if (!betOrder) {
                return res.send(get_status(1013, "can not found bet order"));
            }
            // 查出开奖记录
            const selectBonusInfo = `SELECT win_type, win_key, bet_num, one_key_bonus FROM award_session WHERE account_name = $1 AND gs_id = $2`
            const { rows: [ mineOrderList ] } = await pool.query(selectBonusInfo, [ reqData.account_name, gameSessionInfo.gs_id ]);
            const detail = mineOrderList.map(it => {
                return {
                    "bet_num": it.bet_num,
                    "win_count": it.win_key,
                    "win_type": it.win_type,
                    "win_amount": it.one_key_bonus
                }
            })
            let resData = get_status(1);
            resData.data = {
                periods: gameSessionInfo.periods,
                reward_num: rewardNum,
                reward_time: gameSessionInfo.reward_time,
                bet_time: betOrder.create_time,
                bet_key: betOrder.bet_key,
                bet_amount: betOrder.bet_amount,
                agent_account: betOrder.extra.agent_account,
                transaction_id: betOrder.extra.transaction_id,
                pay_type: betOrder.extra.pay_type,
                detail: detail
            }
            
            res.send(resData);
        }
    } catch (err) {
        logger.error("request gameSessionDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionDetail;