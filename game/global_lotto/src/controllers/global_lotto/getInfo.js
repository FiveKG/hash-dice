// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取全球彩奖池，倒计时，期数" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { pool } = require("../../db");
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const df = require("date-fns");

// 获取全球彩奖池，倒计时，期数
async function getInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        const gameInfo = await getGameInfo();
        const sessionInfo = await getLatestGameSession();
        if (!sessionInfo) {
            return res.send(get_status(1012, "game not exists"));
        }
        const now = new Date();
        const diff = df.differenceInSeconds(sessionInfo.end_time, now);
        // logger.debug("now: ", now);
        // logger.debug("sessionInfo.end_time: ", sessionInfo.end_time);
        // logger.debug("diff: ", diff);
        const data = {
            "count_down": diff,
            "periods": sessionInfo.periods,
            "prize_pool": new Decimal(gameInfo.prize_pool).toFixed(4),
            "quantity": 0.1
        }
        resData.data = data;
        res.send(resData);
    } catch (err) {
        logger.error("request getInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getInfo;