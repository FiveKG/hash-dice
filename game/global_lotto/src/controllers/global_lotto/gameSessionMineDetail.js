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
        
        const selectGameSession = `SELECT periods, reward_num, game_state FROM game_session WHERE periods = $1`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSession, [ reqData.periods ]);

        // 查出投注记录
        const selectBetOrder = `SELECT bet_key, bet_amount, create_time, extra FROM bet_order WHERE account_name = $1 AND gs_id = $2`
        const { rows: [ betOrder ] } = await pool.query(selectBetOrder, [ reqData.account_name, gameSessionInfo.gs_id ]);
        if (!betOrder) {
            return res.send(get_status(1013, "can not found bet order"));
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
                bet_key: betOrder.bet_key,
                bet_amount: betOrder.bet_amount,
                agent_account: betOrder.extra.agent_account,
                transaction_id: betOrder.extra.transaction_id,
                pay_type: betOrder.extra.pay_type,
                bet_num: betOrder.bet_num.split("|")
            }
            
            res.send(resData);
        } else {
            // 查出开奖记录
            let resData = get_status(1);
            resData.data = {
                periods: gameSessionInfo.periods,
                reward_num: rewardNum,
                reward_time: gameSessionInfo.reward_time,
                "prize_pool": { "type": "text",  "is_require": true,  "desc": "本期累积奖池" },
                "award_amount": { "type": "text",  "is_require": true,  "desc": "本期共派奖" },
                "prize_pool_balance": { "type": "text",  "is_require": true,  "desc": "本期奖池余额" },
                "reserve_pool_award": { "type": "text",  "is_require": true,  "desc": "本期储备池拨出" },
                "bottom_pool_award": { "type": "text",  "is_require": true,  "desc": "底池拨入下一期奖池" },
                "next_init_amount": { "type": "text",  "is_require": true,  "desc": "下期奖池初始额" },
                "reward_code": { "type": "text",  "is_require": true,  "desc": "本期中奖号码为" },
                "relate_info": {
                    "type": "objectArray", "desc": "相关 id 及时间",
                    "properties": {
                        "timestamp": { "type": "number",  "is_require": true,  "desc": "相关时间戳" },
                        "id": { "type": "number",  "is_require": true,  "desc": "相关 id" }
                    }
                },
                "detail": {
                    "type": "objectArray", "desc": "全部开奖信息",
                    "properties": {
                        "bonus_type": { "type": "number",  "is_require": true,  "desc": "奖金类型" },
                        "rate": { "type": "number",  "is_require": true,  "desc": "奖金分配比例" },
                        "key_count": { "type": "number",  "is_require": true,  "desc": "中奖数" },
                        "award_amount": { "type": "number",  "is_require": true,  "desc": "派奖金额" },
                        "one_key_bonus": { "type": "number",  "is_require": true,  "desc": "单注奖金" },
                        "award_lists": {
                            "type": "objectArray", "desc": "全部开奖信息",
                            "properties": {
                                "account_name": { "type": "number",  "is_require": true,  "desc": "中奖账号" },
                                "rate": { "type": "number",  "is_require": true,  "desc": "中奖数" },
                                "award_amount": { "type": "number",  "is_require": true,  "desc": "派奖金额" }
                            }
                        }
                    }
                }
            }
            
            
            res.send(resData);
        }
        
    } catch (err) {
        logger.error("request gameSessionMineDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionMineDetail;