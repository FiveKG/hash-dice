// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/openGameSession.js": "openGameSession" });
const { pool,psModifyBalance,psTrx } = require("../db");
const { Decimal } = require("decimal.js");
const {BET_TYPE,SMALL,BIG,TWINS} =require("../controllers/hash_dice/config")
const {AGENT_ACCOUNT,UE_TOKEN,BANKER,PRIVATE_KEY_TEST} =  require("../common/constant/eosConstants")
/**
 * 
 * @param {{open_num:String|Number,
 *          block_num:String|Number}} data 
 */
async function isReward(data){
    try{
        const privateKeys = PRIVATE_KEY_TEST.split(",");

        const open_num = Number(data.open_num);
        const block_num =  Number(data.block_num);
        let reward = '0';

        let sql = `select account_name,bet_num,betting_amount,game_rate,pay_type,agent_account from bet_order where reward_block_num =$1;`;
        const client = await pool.connect();
        let {rows:reward_array} = await client.query(sql,[data.block_num])

        for(let index=0;index<reward_array.length;index++)
        {
            let element = reward_array[index]
            let account_name = element.account_name;
            let amount = new Decimal(element.betting_amount);
            let rate = new Decimal(element.game_rate);
            let bet_num = element.bet_num;
            let pay_type = element.pay_type;
            let agent_account = element.agent_account;
            try{
                //判断是否中奖
                if(bet_num == BIG){
                    if(open_num>BET_TYPE.big){
                        //买大中奖
                        reward = (amount.mul(rate)).toFixed(4)
                    }
                }else if(bet_num == SMALL){
                    if(open_num<BET_TYPE.big){
                        //买小中奖
                        reward = (amount.mul(rate)).toFixed(4)
                    }
                }else if(bet_num == TWINS){
                    if(BET_TYPE.twins.includes(open_num)){
                        //买对子中奖
                        reward = (amount.mul(rate)).toFixed(4)
                    }
                }else if(!isNaN(Number(bet_num))){
                    //买特定值
                    if(open_num<Number(bet_num)){
                        reward = (amount.mul(rate)).toFixed(4)
                    }
                }
                try{
                    if(reward !=='0'){
                        let memo =`hashdice:${account_name}:${reward}`;
                        let transfer_data ={
                            "tokenContract"  : UE_TOKEN,
                            "from"           : BANKER,
                            "to"             : account_name,
                            "quantity"       : reward+" UE",
                            "memo"           : memo,
                            "privateKeyList" : privateKeys
                        }
                        if(pay_type === AGENT_ACCOUNT){
                            //如果是代投,返回游戏码/余额
                                await psModifyBalance.pub({
                                account_name : account_name,
                                cost_amount  : amount,
                                pay_type     : pay_type,
                                agent_account: agent_account
                            });
                            //发送奖励到区块链账户
                            psTrx.pub(transfer_data)
                        }
                        else{
                            //区块链转账
                            transfer_data.quantity = (amount.plus(reward))+" UE";
                            psTrx.pub(transfer_data)
                        }
                    }
                }catch(err){
                    logger.debug(`transfer reward wrong:${err}`);
                    throw err;
                }
                let sql = `UPDATE bet_order
                            SET reward=$1
                            WHERE reward_block_num = $2;`;

                 client.query(sql,[reward,data.block_num])
                .then(res=>console.debug('update reward from table bet_order'))
                .catch(err=>logger.debug(err));    
            }catch(err){
                logger.debug(`UPDATE bet_order wrong:${err}`);
                throw err;
            }
            
        }
    }catch(err){
        throw err
    }
    
    
}

module.exports = isReward;