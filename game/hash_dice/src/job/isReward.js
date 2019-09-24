// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/openGameSession.js": "openGameSession" });
const { pool } = require("../db");
const { Decimal } = require("decimal.js");
const {bet_type,SMALL,BIG,TWINS} =require("../controllers/hash_dice/config")
/**
 * 
 * @param {{open_num:String|Number,
 *          block_num:String|Number}} data 
 */
async function isReward(data){
    try{
        const open_num = Number(data.open_num);
        const block_num =  Number(data.block_num);
        let reward = '0';

        let sql = `select bet_num,betting_amount,game_rate from bet_order where reward_block_num =$1;`;
        const client = await pool.connect();
        let {rows:reward_array} = await client.query(sql,[data.block_num])

        reward_array.forEach(function(element){
            let amount = new Decimal(element.betting_amount);
            let rate = new Decimal(element.game_rate);
            let bet_num = element.bet_num;

    
            //判断是否中奖
            if(bet_num == BIG){
                if(open_num>bet_type.big){
                    //买大中奖
                    reward = (amount.mul(rate)).toFixed(4)
                }
            }else if(bet_num == SMALL){
                if(open_num<bet_type.big){
                    //买小中奖
                    reward = (amount.mul(rate)).toFixed(4)
                }
            }else if(bet_num == TWINS){
                if(bet_type.twins.includes(open_num)){
                    //买对子中奖
                    reward = (amount.mul(rate)).toFixed(4)
                }
            }else if(!isNaN(Number(bet_num))){
                //买特定值
                if(open_num<Number(bet_num)){
                    reward = (amount.mul(rate)).toFixed(4)
                }
            }

            let sql = `UPDATE bet_order
                        SET reward=$1
                        WHERE reward_block_num = $2;`;

            client.query(sql,[reward,data.block_num])

        })
    }catch(err){
        throw err
    }
    
    
}

module.exports = isReward;