// @ts-check
const logger = require("../../common/logger").child({ [__filename]: "get banker" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const {BANKER} =  require("../../common/constant/eosConstants")
const getBalance = require("../../job/getCurrencyBalance")
/**
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
async function getBanker(req,res,next){
    try {
        let banker =  await getBalance(BANKER)
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`,reqData);
        let resData = get_status(1);
        resData["data"] = {
            balance : banker
        }
        //@ts-ignore
        res.send(resData);
    } catch (err) {
        logger.error("request get_banker error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getBanker;