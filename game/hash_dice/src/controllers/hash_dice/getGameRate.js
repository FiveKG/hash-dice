// @ts-check
const logger = require("../../common/logger").child({ "@controllers/hash_dice/getGameRate.js": "获取赔率"});
const { get_status, inspect_req_data } = require("../../common/index.js");
const {game_rate} = require("./config")
/**
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
async function getGameRate(req,res,next){
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`,reqData);

        let resData = get_status(1);

        resData["data"] = game_rate;
        //@ts-ignore
        res.send(resData);
    } catch (err) {
        logger.error("request getGameRate error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getGameRate;