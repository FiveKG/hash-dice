// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取当前用户某一期投注的详情" });
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
        
        const selectGameSession = `SELECT gs_id, periods, reward_num, game_state, reward_time FROM game_session WHERE periods = $1`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSession, [ reqData.periods ]);
        logger.debug("gameSessionInfo: ", gameSessionInfo);
        if (!gameSessionInfo) {
            return res.send(get_status(1012, "game not exists"));
        }
        // 查出投注记录
        const selectBetOrder = `SELECT bet_num, key_count, amount, create_time, extra FROM bet_order WHERE account_name = $1 AND gs_id = $2`
        const { rows: [ betOrder ] } = await pool.query(selectBetOrder, [ reqData.account_name, gameSessionInfo.gs_id ]);
        logger.debug("betOrder: ", betOrder);
        if (!betOrder) {
            return res.send(get_status(1014, "can not found bet order"));
        }

        // 如果游戏是开始状态或者是待开奖
        let rewardNum = gameSessionInfo.reward_num;
        if (gameSessionInfo.game_state === GAME_STATE.START || gameSessionInfo.game_state == GAME_STATE.REWARDING) {
            rewardNum = gameSessionInfo.reward_num;
            let resData = get_status(1);
            resData.data = {
                periods: gameSessionInfo.periods,
                reward_time: gameSessionInfo.reward_time,
                bet_time: betOrder.create_time,
                bet_key: betOrder.key_count,
                bet_amount: betOrder.amount,
                agent_account: betOrder.extra.agent_account,
                transaction_id: betOrder.extra.transaction_id,
                pay_type: betOrder.extra.pay_type,
                bet_num: betOrder.bet_num.split("|")
            }
            
            res.send(resData);
        } else {
            // 查出投注记录
            const selectBetOrder = `SELECT key_count, amount, create_time, extra FROM bet_order WHERE account_name = $1 AND gs_id = $2`
            const { rows: [ betOrder ] } = await pool.query(selectBetOrder, [ reqData.account_name, gameSessionInfo.gs_id ]);
            if (!betOrder) {
                return res.send(get_status(1014, "can not found bet order"));
            }
            // 查出开奖记录
            const selectBonusInfo = `SELECT win_type, win_key, bet_num, one_key_bonus FROM award_session WHERE account_name = $1 AND bo_id = $2`
            const { rows: myOrderList } = await pool.query(selectBonusInfo, [ reqData.account_name, betOrder.bo_id ]);
            logger.debug("myOrderList: ", myOrderList);
            const detail = myOrderList.map(it => {
                return {
                    "bet_num": it.bet_num,
                    "win_count": it.win_key,
                    "win_type": it.win_type,
                    "win_amount": it.one_key_bonus
                }
            });
            let resData = get_status(1);
            resData.data = {
                periods: gameSessionInfo.periods,
                reward_num: rewardNum,
                reward_time: gameSessionInfo.reward_time,
                bet_time: betOrder.create_time,
                bet_key: betOrder.key_count,
                bet_amount: betOrder.amount,
                agent_account: betOrder.extra.agent_account,
                transaction_id: betOrder.extra.transaction_id,
                pay_type: betOrder.extra.pay_type,
                detail: detail
            }
                        
            res.send(resData);
        }
        
    } catch (err) {
        logger.error("request gameSessionMineDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionMineDetail;