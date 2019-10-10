// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "随机投注" });
const { get_status, inspect_req_data } = require("../../common/index.js");

// 随机投注
/**
 * @param {any} req
 * @param {{ send: (arg0: import("../../common/get_status.js").Status) => void; }} res
 * @param {any} next
 */
async function getRandomBetCode(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const tmp = [];
        // 每个 key 生成一组号码
        for (let i = 0; i < reqData.bet_key; i++) {
            tmp.push(Math.random().toString().slice(-9).split("").join(","));
        }
        let resData = get_status(1, { bet_num: Math.random().toString().slice(-9).split("").join(",") });
        res.send(resData);
    } catch (err) {
        logger.error("request getRandomBetCode error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getRandomBetCode;