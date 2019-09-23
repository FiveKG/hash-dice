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
        logger.debug(`betOrderList: `, reqData);
        const latestGameSession = await getLatestGameSession(reqData.game_id);
        logger.debug(`latestGameSession: `, latestGameSession);
        if (!latestGameSession) {
            return res.send(get_status(1012, "game not exists"));
        }
        const selectBetOrder = `SELECT * FROM bet_order bo JOIN game_session gs ON gs.gs_id = bo.gs_id WHERE account_name = $1`
        const { rows: betOrderList } = await pool.query(selectBetOrder, [ reqData.account_name ]);
        logger.debug(`betOrderList: `, betOrderList);
        const detail = []
        for (const info of betOrderList) {
            let awardCode = "000000";
            if (info.periods === latestGameSession.periods) {
                awardCode = "000000";
            } else {
                awardCode = info.reward_code;
            }

            const result = detail.find(it => it.periods === info.periods);
            if (!!result) {
                result.key_count = result.key_count + info.key_count;
                result.bonus_amount = new Decimal(result.bonus_amount).add(info.bonus_amount);
            } else {
                detail.push({
                    "periods": info.periods,
                    "reward_code": awardCode,
                    "bonus_amount": info.bonus_amount,
                    "key_count": info.key_count
                })
            }
        }

        let resData = get_status(1);
        resData.data = {
            "detail": detail
        }
        res.send(resData);
    } catch (err) {
        logger.error("request gameSessionMine error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSessionMine;