// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "随机投注" });
const { get_status, inspect_req_data, xhr } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { selectGameSessionByPeriods } = require("../../models/game");
const { GAME_STATE } = require("../../common/constant/gameConstants");
const { pool, psBet } = require("../../db");
const url = require("url");
const df = require("date-fns");

// 随机投注
async function randomBet(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const TBG_SERVER = process.env.TBG_SERVER || "http://localhost:9527/";
        const gameSessionInfo = await selectGameSessionByPeriods(reqData.periods);
        // 这一期游戏不存在
        if (!gameSessionInfo) {
            return res.send(get_status(1012, "game not exists"));
        }

        // 判断投注的数量和额度是否符合
        if (!new Decimal(0.1).mul(reqData.bet_key).eq(reqData.bet_amount)) {
            return res.send(get_status(1015, "bet amount does not match"))
        }

        // 如果游戏不是开始状态, 不可投注
        if (gameSessionInfo.game_state !== GAME_STATE.START) {
            return res.send(get_status(1013, "game is not start, can not bet"));
        }

        const opts = { data: { account_name: reqData.account_name } };
        // 获取用户彩码，游戏码，余额
        const { data: [ resp ] } = await xhr.get(url.resolve(TBG_SERVER, "/balance/game_balance"), opts);
        if (!resp.lotto_currency) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        logger.debug("resp: ", resp);
        // 全球彩彩码
        const lottoCurrency = new Decimal(resp.lotto_currency);
        // 可提现余额
        const withdrawEnable = new Decimal(resp.withdraw_enable);
        let psData = {};
        // 投注类型为随机
        const betType = "random"
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
                    "bet_type": betType
                }
            }
        } else {
            // 使用彩码投注
            psData = {
                "periods": reqData.periods,
                "account_name": reqData.account_name,
                "bet_key": reqData.bet_key,
                "bet_amount": reqData.bet_amount,
                "pay_type": "lotto_currency",
                "bet_type": betType
            }
        }
        let resData = get_status(1, "投注信息已提交");
        res.send(resData);

        // 提交投注信息
        await psBet.pub(psData);
    } catch (err) {
        logger.error("request randomBet error, the error stock is %O", err);
        throw err;
    }
}

module.exports = randomBet;