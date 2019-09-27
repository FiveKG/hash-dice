// @ts-check
const logger = require("../../common/logger").child({ "@controllers/hash_dice/getGameRate.js": "get game rate"});
const { get_status, inspect_req_data } = require("../../common/index.js");
const {GAME_RATE} = require("./config")
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

        resData["data"] = GAME_RATE;
        //@ts-ignore
        res.send(resData);
    } catch (err) {
        logger.error("request getGameRate error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getGameRate;