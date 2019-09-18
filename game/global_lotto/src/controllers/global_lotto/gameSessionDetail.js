// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取某一期开奖详情" });
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
        const selectGameSession = `SELECT periods, reward_num, game_state, extra FROM game_session WHERE periods = $1`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSession, [ reqData.periods ]);
        if (!gameSessionInfo) {
            return res.send(get_status(1012, "game not exists"));
        }
        // 如果游戏是开始状态或者是待开奖
        let resData = get_status(1);
        if (gameSessionInfo.game_state === GAME_STATE.START || gameSessionInfo.game_state == GAME_STATE.REWARDING) {
            resData.data = {
                "gs_id": gameSessionInfo.gs_id,
                "count_down": df.differenceInSeconds(new Date(), gameSessionInfo.end_time),
                "reward_time": gameSessionInfo.reward_time,
                "prize_pool": new Decimal(gameInfo.prize_pool).toFixed(4)
            }
            
            res.send(resData);
        } else {
            // 查找累积奖池和累积发放额
            const selectTotalAward = `
                SELECT 
                    sum(SELECT change_amount FROM prize_pool WHERE change_amount > 0) AS total, 
                    sum(SELECT change_amount FROM prize_pool_log WHERE change_amount < 0) AS total_award`
            const { rows: [{ total, total_award }] } = await pool.query(selectTotalAward);
            // 查找本期奖池变动
            const selectPrizePoolLogInfo = `SELECT current_balance, extra FROM prize_pool_log WHERE gs_id = $1 AND pool_type = $2 AND op_type = $3`
            const { rows: [ prizePoolLogInfo ] } = await pool.query(selectPrizePoolLogInfo, [ gameSessionInfo.gs_id, 'prize_pool', 'award' ]);
            // 查找本期储备池变动
            // const selectReservePoolInfo = `SELECT current_balance, change_amount FROM prize_pool_log WHERE gs_id = $1 AND pool_type = $2 AND op_type = $3`
            // const { rows: [ reservePoolLogInfo ] } = await pool.query(selectReservePoolInfo, [ gameSessionInfo.gs_id, 'reserve_pool', 'award' ]);
            
            // 查找中奖名单
            const selectAwardList = `SELECT * FROM award_session WHERE gs_id = $1`;
            const { rows: awardList } = await pool.query(selectAwardList, [ gameSessionInfo.gs_id ]);

            const rewardMap = new Map();
            // 遍历开奖信息
            for (const info of awardList) {
                // 统计所有 key 中奖的用户
                // account_name, create_time, bet_num, win_key, win_type, one_key_bonus, bonus_amount
                let accRewardInfo = rewardMap.get(info.win_key);
                if (!!accRewardInfo) {
                    accRewardInfo.push({
                        "bonus_type": info.win_type,
                        "rate": info.extra.award_rate,
                        "key_count": info.win_key,
                        "award_amount": info.bonus_amount,
                        "one_key_bonus": info.one_key_bonus,
                        "account_name": info.account_name
                    })
                } else {
                    accRewardInfo = [];
                    accRewardInfo.push({
                        "bonus_type": info.win_type,
                        "rate": info.extra.award_rate,
                        "key_count": info.win_key,
                        "award_amount": info.bonus_amount,
                        "one_key_bonus": info.one_key_bonus,
                        "account_name": info.account_name
                    })
                    rewardMap.set(info.win_key, accRewardInfo);
                }
            }

            const detail = [];
            for (const [ key, val ] of rewardMap) {
                let award_rate = null;
                let win_type = null;
                let win_key = 0;
                let one_key_bonus = new Decimal(0);
                let award_amount = new Decimal(0);
                const award_lists = []
                for (const info of val) {
                    if (!award_rate) {
                        award_rate = info.rate;
                    }
                    if (!win_type) {
                        win_type = info.bonus_type;
                    }
                    if (!win_key) {
                        win_key = win_key + info.key_count;
                    }
                    award_lists.push({
                        "account_name": info.account_name,
                        "win_key": info.key_count,
                        "award_amount": info.one_key_bonus
                    });
                    award_amount = award_amount.add(info.one_key_bonus);
                }
                detail.push({
                    "bonus_type": win_type,
                    "rate": award_rate,
                    "key_count": win_key,
                    "award_amount": award_amount,
                    "one_key_bonus": one_key_bonus,
                    "award_lists": award_lists
                });
            }

            resData.data = {
                "periods": gameSessionInfo.periods,
                "reward_time": gameSessionInfo.reward_time,
                "prize_pool": new Decimal(total).toFixed(4),
                "award_amount": new Decimal(total_award).abs().toFixed(4),
                "prize_pool_balance": new Decimal(prizePoolLogInfo.current_balance).toFixed(4),
                "reserve_pool_award": new Decimal(prizePoolLogInfo.extra.reserve_pool_change).abs().toFixed(4),
                "bottom_pool_award": new Decimal(prizePoolLogInfo.extra.bottom_pool_change).toFixed(4),
                "next_init_amount": new Decimal(prizePoolLogInfo.current_balance).add(prizePoolLogInfo.extra.bottom_pool_change).toFixed(4),
                "reward_code": gameSessionInfo.reward_num,
                "relate_info": gameSessionInfo.extra.relate_id,
                "is_lottery_award": prizePoolLogInfo.extra.is_lottery_award, // 是否开出超级大奖
                "detail": detail
            }
            
            res.send(resData);
        }
    } catch (err) {
        logger.error("request gameSessionDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionDetail;