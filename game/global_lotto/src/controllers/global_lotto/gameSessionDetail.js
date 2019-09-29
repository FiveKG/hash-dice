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
        const selectGameSession = `SELECT gs_id, periods, reward_num, game_state, extra, reward_time FROM game_session WHERE gs_id = $1`
        const { rows: [ gameSessionInfo ] } = await pool.query(selectGameSession, [ reqData.gs_id ]);
        logger.debug("gameSessionInfo: ", gameSessionInfo);
        if (!gameSessionInfo) {
            return res.send(get_status(1012, "game not exists"));
        }
        // 如果游戏是开始状态或者是待开奖
        let resData = get_status(1);
        if (gameSessionInfo.game_state === GAME_STATE.START || gameSessionInfo.game_state == GAME_STATE.REWARDING) {
            resData.data = {
                "periods": gameSessionInfo.periods,
                "count_down": df.differenceInSeconds(gameSessionInfo.reward_time, new Date()),
                "reward_time": gameSessionInfo.reward_time,
                "prize_pool": new Decimal(gameInfo.prize_pool).toFixed(4)
            }
            
            return res.send(resData);
        } else {
            // 查找本期奖池变动
            const selectPrizePoolLogInfo = `SELECT current_balance, extra FROM prize_pool_log WHERE gs_id = $1 AND pool_type = $2 AND op_type = $3`
            const { rows: [ prizePoolLogInfo ] } = await pool.query(selectPrizePoolLogInfo, [ reqData.gs_id, 'prize_pool', 'award' ]);
            logger.debug("prizePoolLogInfo: ", prizePoolLogInfo);
            // 查找中奖名单
            const selectAwardList = `SELECT * FROM award_session WHERE bo_id = any(SELECT bo_id FROM bet_order WHERE gs_id = $1)`;
            const { rows: awardList } = await pool.query(selectAwardList, [ gameSessionInfo.gs_id ]);
            logger.debug("awardList: ", awardList);
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
                if (win_type !== "sorry") {
                    detail.push({
                        "bonus_type": win_type,
                        "rate": award_rate,
                        "key_count": win_key,
                        "award_amount": award_amount,
                        "one_key_bonus": one_key_bonus,
                        "award_lists": award_lists
                    });
                }
            }

            // 查找累积奖池和累积发放额
            const selectTotal = `SELECT sum(change_amount) AS total FROM prize_pool_log WHERE change_amount > 0`;
            const selectTotalAward = `SELECT sum(change_amount) AS total_award FROM prize_pool_log WHERE change_amount < 0`;
            const { rows: [ { total } ] } = await pool.query(selectTotal);
            const { rows: [ { total_award } ] } = await pool.query(selectTotalAward);
            resData.data = {
                "periods": gameSessionInfo.periods,
                "reward_time": gameSessionInfo.reward_time,
                "prize_pool": new Decimal(!total ? 0 : total).toFixed(4),
                "award_amount": new Decimal(!total_award ? 0 : total_award).abs().toFixed(4),
                "prize_pool_balance": new Decimal(!prizePoolLogInfo ? 0 : prizePoolLogInfo.current_balance).toFixed(4),
                "reserve_pool_award": new Decimal(!!prizePoolLogInfo ? 0 : prizePoolLogInfo.extra.reserve_pool_change).abs().toFixed(4),
                "bottom_pool_award": new Decimal(!prizePoolLogInfo ? 0 : prizePoolLogInfo.extra.bottom_pool_change).toFixed(4),
                "next_init_amount": new Decimal(!prizePoolLogInfo ? 0 : prizePoolLogInfo.current_balance).add(prizePoolLogInfo.extra.bottom_pool_change).toFixed(4),
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