// @ts-check
const logger = require("../../common/logger").child({ [__filename]: "betting" });
const { get_status, inspect_req_data, xhr } = require("../../common/index.js");
const { pool } = require("../../db");
const { Decimal } = require("decimal.js");
const url = require("url");
const shortid = require('shortid')
const {game_rate} = require('./config')
/**
 * 获取所有的投注
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
async function betting(req,res,next){
    try {
        let reqData = await inspect_req_data(req);

        logger.debug(`the param is: %j`,reqData);

        let resData                           = get_status(1);
        let {account_name,bet_num,bet_amount} = reqData;
        let id                                = shortid.generate();
        let bet_block_num                     = shortid.generate();  //从区块链中获取
        let odds_rate                         = null;
        let obj                               = null;

        if(obj=game_rate.find(function(element){
            return  element.bet_type == bet_num
            })
        ){
        }else{
            obj = game_rate.find(function(element){
                return  element.bet_type == 'smaller'
                })
        }
        //@ts-ignore
        odds_rate = obj.odds_rate


        //查出玩家余额
        // const TBG_SERVER = process.env.TBG_SERVER || "http://localhost:13022/";
        // const opts = { data: { account_name: "gametestuser" } };
        // const { data: resp } = await xhr.get(url.resolve(TBG_SERVER, "/balance/game_balance"), opts);

        let sql = `INSERT INTO public.bet_order(
            id, bet_block_num,extra, account_name, betting_time, bet_num, betting_amount, reward, game_rate, agent_account, create_time)
            VALUES ($1,$2,'{}',$3, now(),$4,$5,'',$6,'', now());`
        let {rows} = await pool.query(sql,[id,bet_block_num,account_name,bet_num,bet_amount,odds_rate])
        
        //@ts-ignore
        res.send(resData);
    } catch (err) {
        logger.error("request getGameRate error, the error stock is %O", err);
        throw err;
    }
}

module.exports = betting;