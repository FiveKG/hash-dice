// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "投注" });
const { get_status, inspect_req_data, xhr } = require("../../common/index.js");
const { pool, psBet } = require("../../db");
const { getLatestGameSession } = require("../../models/game");
const { GAME_STATE } = require("../../common/constant/gameConstants");
const { Decimal } = require("decimal.js");
const url = require("url");
const df = require("date-fns");

// 投注
async function bet(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);

        let sql = `
            SELECT gs.periods, gs.gs_id, game.game_name, game.key_count, game.quantity, gs.game_state
                FROM game_session gs 
                JOIN game ON game.g_id = gs.g_id 
                WHERE gs.g_id = $1 
                AND gs.game_state = $2
                ORDER BY periods ASC 
                LIMIT 1
        `
        let { rows: [ gameSessionInfo ] } = await pool.query(sql, [ reqData.game_id, GAME_STATE.START ]);
        if (!gameSessionInfo) {
            return res.send(get_status(1012, "game not exists"));
        }

        logger.debug("gameSessionInfo: ", gameSessionInfo);

        // 如果游戏不是开始状态, 不可投注
        if (gameSessionInfo.game_state !== GAME_STATE.START || gameSessionInfo.periods !== reqData.periods) {
            return res.send(get_status(1013, "game is not start, can not bet"));
        }

        const TBG_SERVER = process.env.TBG_SERVER || "http://localhost:9527/";
        const opts = { data: { account_name: reqData.account_name } };
        // 获取用户彩码，游戏码，余额
        const { data: [ resp ] } = await xhr.get(url.resolve(TBG_SERVER, "/balance/game_balance"), opts);
        logger.debug("resp: ", resp);
        // 游戏码
        const lottoCurrency = new Decimal(resp.game_currency);
        // 可提现余额
        const withdrawEnable = new Decimal(resp.withdraw_enable);
        let psData = {};
        // 如果彩码额度低于下注额度
        if (lottoCurrency.lessThan(reqData.bet_amount)) {
            // 如果彩码额度低于下注额度
            if (withdrawEnable.lessThan(reqData.bet_amount)) {
                return res.send(get_status(1011, "insufficient balance"));
            } else {
                // 使用余额投注
                psData = {
                    "periods": reqData.periods,
                    "account_name": reqData.account_name,
                    "bet_key": reqData.bet_key,
                    "bet_amount": reqData.bet_amount,
                    "pay_type": "withdraw_enable",
                    "g_id": reqData.game_id
                }
            }
        } else {
            // 使用彩码投注
            psData = {
                "periods": reqData.periods,
                "account_name": reqData.account_name,
                "bet_key": reqData.bet_key,
                "bet_amount": reqData.bet_amount,
                "pay_type": "game_currency",
                "g_id": reqData.game_id
            }
        }
        
        let resData = get_status(1, "投注信息已提交");
        res.send(resData);

        // 提交投注信息
        await psBet.pub(psData);
    } catch (err) {
        logger.error("request bet error, the error stock is %O", err);
        throw err;
    }
}

module.exports = bet;