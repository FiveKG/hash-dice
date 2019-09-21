// @ts-check
const logger = require("../../common/logger").child({ [__filename]: "get User Bet Detail" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { pool } = require("../../db");
/**
 * 获取所有的投注
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
async function getUserBetDetail(req,res,next){
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: %j`,reqData);
        let resData = get_status(1);

        // 查出投注记录
        const sql = `
        SELECT b.create_time,b.bet_block_num,b.reward_block_num,b.bet_num,b.betting_amount,b.game_rate,b.agent_account,b.reward,r.reward_block_id,r.reward_num
                FROM bet_order AS b INNER JOIN reward as r on 
                b.reward_block_num = r.reward_block_num where b.account_name =$1 ;`
        const { rows } = await pool.query(sql,[reqData.id]);
        if (!rows) {
            return res.send(get_status(1013, "can not found bet order"));
        }
        
        let result = rows.pop();
        resData['data'] ={
            "create_time"     : result.create_time,
            "bet_num"         : result.bet_num,
            "betting_amount"  : result.betting_amount,
            "game_rate"       : result.game_rate,
            "agent_account"   : result.agent_account,
            "reward"          : result.reward,
            "bet_block_num"   : result.bet_block_num,
            "reward_block_num": result.reward_block_num,
            "reward_block_id" : result.reward_block_id,
            "reward_num"      : result.reward_num
        }
        
        res.send(resData);
    } catch (err) {
        logger.error("request getGameRate error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getUserBetDetail;