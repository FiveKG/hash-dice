// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/hash_dice/getUserBetList.js": "获取所有用户投注的信息" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { pool } = require("../../db");
/**
 * 获取当前用户投注信息
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getUserBetList(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        let resData = get_status(1);
      
        let sql = `SELECT id,create_time,bet_num,betting_amount,reward FROM bet_order WHERE account_name =$1;`
        let {rows}= await pool.query(sql,[reqData.account_name])


        resData['data'] = rows
        res.send(resData);
    } catch (err) {
        logger.error("request getMyBetList error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getUserBetList;