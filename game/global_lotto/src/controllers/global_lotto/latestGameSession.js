// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "最新一期开奖情况" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const df = require("date-fns");

// 最新一期开奖情况
async function latestGameSession(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        const gameInfo = await getGameInfo();
        const info = await getLatestGameSession();
        if (!info) {
            return res.send(get_status(1012, "game not exists"));
        }
        const now = df.format(new Date(), "YYYY-MM-DD HH:mm:ssZ")
        const diff = df.differenceInSeconds(info.end_time, now)
        logger.debug(`info.end_time: `, info.end_time);
        logger.debug(`now: `, now);
        logger.debug("diff: ", diff);
        resData.data = {    
            "gs_id": info.gs_id,
            "count_down": diff,
            "reward_time": info.reward_time,
            "prize_pool": new Decimal(gameInfo.prize_pool).toFixed(4)
        }
        res.send(resData);
    } catch (err) {
        logger.error("request latestGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = latestGameSession;