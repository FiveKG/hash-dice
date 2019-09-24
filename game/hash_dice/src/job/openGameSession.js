// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/openGameSession.js": "openGameSession" });
const { OPEN_CODE_COUNT } = require("../common/constant/gameConstants");
const { rpc } = require("./getTrxAction");
const { pool } = require("../db");
const isReward = require("./isReward")
/**
 * 获取开奖区块号信息
 * @param {Number|String} open_blockNum
 * @returns {Promise<{
 *                    timestamp:String,
 *                    id       : String,
 *                    block_num: String,
 *                    open_num : String
 *                   }>
 *          }
 */
async function getOpenResult(open_blockNum){
    let count = 0;
    let open_block_num = Number(open_blockNum);
    let open_num = "";

    // 获取开奖相关的区块信息
    while(true){
        try {
            const last_block = (await rpc.get_info()).head_block_num;
            if(open_block_num>Number(last_block)){
                console.debug('waiting for lottery results...')
                console.debug(`The open block num is: ${open_block_num}  The last block num is:${last_block}`)
                continue
            }
            const resp = await rpc.get_block(open_block_num);
            console.debug(`find block:${resp.block_num},the id:${resp.id}`)

            const openResult = {
                timestamp: resp.timestamp,
                id       : resp.id,
                block_num: resp.block_num,
                open_num : ''
            }
    
            //获取最后2位数字
            for(let index=resp.id.length;index>1;index--){
                let num = resp.id[index];
                if(!isNaN(Number(num))){
                open_num += num;
                count ++;
                if (count === OPEN_CODE_COUNT) {
                    open_num =open_num.split('').reverse().join('')
                    openResult.open_num = open_num
                    break;
                }
            }      
        }
            console.debug("the openResult is: ", open_num);
            return openResult
            
        } catch (err) {
            throw err;
        }
    }
   
}

/**
 * 游戏开奖
 * @param {Number|String} open_blockNum
 */
async function openGameSession(open_blockNum) {
    try {
        let open_data = await getOpenResult(open_blockNum);
        let sql = `INSERT INTO public.reward(
            reward_block_num, reward_block_id, reward_num, create_time)
            VALUES ($1,$2,$3,$4);`
        const client = await pool.connect();   
        client.query(sql, [open_data.block_num,open_data.id,open_data.open_num,open_data.timestamp]);
        //是否中奖
        let data = {
            open_num:open_data.open_num,
            block_num:open_data.block_num
        }
        isReward(data)
    } catch (err) {
        logger.error("openGameSession error, the error stock is %O", err);
        throw err;
    }
}

module.exports = openGameSession