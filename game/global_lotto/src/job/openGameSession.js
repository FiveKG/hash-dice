// @ts-check
const logger = require("../common/logger.js").child({ "@src/job/openGameSession.js": "游戏开奖" });
const { Decimal } = require("decimal.js");
const { pool } = require("../db");
const { GLOBAL_LOTTO_CONTRACT } = require("../common/constant/eosConstants");
const { redis, generate_primary_key } = require("../common");
const { getGameInfo, insertGameSession, getLastGameSession } = require("../models/game");
const { scheduleJob } = require("node-schedule");
const { rpc } = require("./getTrxAction");
const df = require("date-fns");

/**
 * 游戏开奖
 * @param {{ block_num: number }} data
 */
async function openGameSession(data) {
    try {
        await getBlocks(data.block_num);
    } catch (err) {
        logger.error("startGameSession error, the error stock is %O", err);
        throw err;
    }
}
  
/**
 * 获取区块链信息
 * @param { number } block_num 
 */
async function getBlocks(block_num) {
    rpc.get_block(block_num).then(res => {
        try {
            const data = {
                block_num: res.block_num,
                timestamp: res.timestamp,
                id: res.id
            }
            block_num++;
            getBlocks(block_num);
        } catch (error) {
            // logger.log('getBlocks', error);
        }
    }).catch(err => {
        getBlocks(block_num);
    })
}

module.exports = openGameSession