// @ts-check
const logger = require("../../common/logger").child({ [__filename]: "get Bet List" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { pool } = require("../../db");
/**
 * 获取所有的投注
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
async function getBetList(req,res,next){
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`,reqData);
        let resData = get_status(1);

        // 查出投注记录
        const sql = 'SELECT account_name,create_time,reward,game_rate FROM bet_order;'
        const { rows } = await pool.query(sql);
        if (!rows) {
            return res.send(get_status(1013, "can not found bet order"));
        }

        let result = rows.reduce(
            (acc,cur)=>acc.concat(cur),
            []
        )
        resData["data"] =result
        //@ts-ignore
        res.send(resData);
    } catch (err) {
        logger.error("request getGameRate error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getBetList;