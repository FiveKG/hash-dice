// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取某一期开奖详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const { pool } = require("../../db");
const { GAME_STATE } = require("../../common/constant/gameConstants");

// 获取某一期开奖详情
async function gameSessionDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const selectAwardSql = `
            SELECT gs.periods, gs.gs_id, gs.game_state, game.game_name, game.key_count, game.quantity, gs.extra, gs.reward_code
                FROM game_session gs 
                JOIN game ON game.g_id = gs.g_id 
                WHERE gs.g_id = $1 
                AND gs.periods = $2
        `
        const { rows: [ gameSessionInfo ] } = await pool.query(selectAwardSql, [ reqData.game_id, reqData.periods ]);
        if (!gameSessionInfo) {
            return res.send(get_status(1012, "game not exists"));
        }

        let resData = get_status(1);
        // 判断是不是最新一期
        const quantity =  new Decimal(gameSessionInfo.quantity);
        const totalAmount = quantity.mul(gameSessionInfo.key_count);
        if (gameSessionInfo.game_state === GAME_STATE.START) {
            const selectBetOrder = `SELECT * FROM bet_order WHERE gs_id = $1`
            const { rows: betOrderList } = await pool.query(selectBetOrder, [ gameSessionInfo.gs_id ]);
            let betKey = 0;
            if (betOrderList.length !== 0) {
                betKey = betOrderList.map(it => it.key_count).reduce((pre, curr) => pre + curr);
            }

            resData.data = {
                "game_name": gameSessionInfo.game_name,  
                "periods": gameSessionInfo.periods,
                "bet_key": betKey,
                "total_key": gameSessionInfo.key_count,
                "total_amount": totalAmount.toNumber(),
                "quantity": quantity.toNumber(),
                "lucky_code": gameSessionInfo.reward_code,
            }
            res.send(resData);
        } else {
            resData.data = {
                "game_name": gameSessionInfo.game_name,  
                "periods": gameSessionInfo.periods,
                "last_bet_account": gameSessionInfo.extra.account_name,
                "total_key": gameSessionInfo.key_count,
                "total_amount": totalAmount.toNumber(),
                "quantity": quantity.toNumber(),
                "trx_id": gameSessionInfo.extra.transaction_id,
                "lucky_code": gameSessionInfo.reward_code,
                "bonus_trx_id": gameSessionInfo.extra.bonus_trx_id,
                "agent_account": gameSessionInfo.extra.agent_account,
                "win_account": gameSessionInfo.extra.win_account,
                "pay_type": gameSessionInfo.extra.pay_type,
                "constants_num": 100001
            }
            res.send(resData);
        }
    } catch (err) {
        logger.error("request gameSessionDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionDetail;