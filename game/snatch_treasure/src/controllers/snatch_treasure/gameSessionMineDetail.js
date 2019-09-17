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
        const selectAwardSql = `
            SELECT gs.periods, gs.gs_id, gs.game_state, game.game_name, game.key_count, gs.reward_code,
                game.quantity, bo.bet_code, bo.bonus_code, bo.bonus_amount, bo.amount, bo.key_count AS bet_key_count,
                bo.extra AS bet_extra, gs.extra AS gs_extra
                FROM game_session gs 
                JOIN game ON game.g_id = gs.g_id 
                JOIN bet_order bo ON bo.gs_id = gs.gs_id
                WHERE gs.g_id = $1 
                AND gs.periods = $2
                AND bo.account_name = $3
        `
        const { rows: [ rewardInfo ] } = await pool.query(selectAwardSql, [ reqData.game_id, reqData.periods, reqData.account_name ]);
        if (!rewardInfo) {
            return res.send(get_status(1014, "can not found user bet record"));
        }

        let resData = get_status(1);
        // 判断是不是最新一期
        const quantity =  new Decimal(rewardInfo.quantity);
        const totalAmount = quantity.mul(rewardInfo.key_count);
        if (rewardInfo.game_state === GAME_STATE.START) {
            const selectBetOrder = `SELECT * FROM bet_order WHERE gs_id = $1`
            const { rows: betOrderList } = await pool.query(selectBetOrder, [ rewardInfo.gs_id ]);
            let betKey = 0;
            if (betOrderList.length !== 0) {
                betKey = betOrderList.map(it => it.key_count).reduce((pre, curr) => pre + curr);
            }

            resData.data = {
                "game_name": rewardInfo.game_name,  
                "periods": rewardInfo.periods,
                "bet_key": betKey,
                "total_key": rewardInfo.key_count,
                "total_amount": totalAmount.toNumber(),
                "bet_num": rewardInfo.bet_code,
                "bet_amount": rewardInfo.amount,
                "agent_account": rewardInfo.bet_extra.agent_account,
                "pay_type": rewardInfo.bet_extra.pay_type,
                "quantity": quantity.toNumber()
            }
            res.send(resData);
        } else {
            resData.data = {
                "game_name": rewardInfo.game_name,
                "periods": rewardInfo.periods,
                "agent_account": rewardInfo.bet_extra.agent_account,
                "last_bet_account": rewardInfo.gs_extra.win_account,
                "total_key": rewardInfo.key_count,
                "total_amount": totalAmount.toNumber(),
                "quantity": quantity.toNumber(),
                "bet_key": rewardInfo.bet_key_count,
                "bet_num": rewardInfo.bet_code,
                "bet_amount": rewardInfo.amount,
                "pay_type": rewardInfo.bet_extra.pay_type,
                "trx_id": rewardInfo.bet_extra.transaction_id,
                "lucky_code": rewardInfo.reward_code,
                "constants_num": 100001
            }
            res.send(resData);
        }
    } catch (err) {
        logger.error("request gameSessionMineDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionMineDetail;