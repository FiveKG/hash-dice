// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取当前用户投注的信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const df = require("date-fns");
const { pool } = require("../../db");
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const { GAME_STATE } = require("../../common/constant/gameConstants");

// 获取当前用户投注的信息
async function gameSessionMine(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const latestGameSession = await getLatestGameSession(reqData.game_id);
        if (!latestGameSession) {
            return res.send(get_status(1012, "game not exists"));
        }
        const selectBetOrder = `SELECT * FROM bet_order WHERE gs_id = $1 AND account_name = $2`
        const { rows: betOrderList } = await pool.query(selectBetOrder, [ latestGameSession.gs_id, reqData.account_name ]);
        let resData = get_status(1);
        resData.data = {
            "detail": betOrderList.map(it => {
                let awardCode = "000000";
                if (it.periods === latestGameSession.periods) {
                    awardCode = "000000";
                } else {
                    awardCode = it.reward_code;
                }

                return {
                    "periods": it.periods,
                    "reward_code": awardCode,
                    "bonus_amount": it.bonus_amount,
                    "key_count": it.key_count
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