// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/global_lotto/gameSession.js": "获取所有期数及开奖信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { getRewardGameSession } = require("../../models/game");
const df = require("date-fns");

// 获取所有期数及开奖信息
async function gameSession(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        const info =  await getRewardGameSession();
        const data = info.map(it => {
            return {
                "gs_id": it.gs_id,
                "periods": it.periods,
                "reward_time": it.reward_time,
                "reward_num": it.reward_num
            }
        });

        resData.data = data;
        
        res.send(resData);
    } catch (err) {
        logger.error("request gameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = gameSession;