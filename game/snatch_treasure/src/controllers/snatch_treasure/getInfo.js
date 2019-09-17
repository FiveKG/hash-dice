// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "获取游戏信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { pool } = require("../../db");
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const df = require("date-fns");

// 获取游戏信息
async function getInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
        const gameInfo = await getGameInfo();
        resData.data = gameInfo.map(it => {
            return {
                game_id: it.g_id,
                game_name: it.game_name
            }
        })
        res.send(resData);
    } catch (err) {
        logger.error("request getInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getInfo;