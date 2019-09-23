//@ts-check
const logger        = require("@fjhb/logger").child({"@": "gameManager"});
const redis         = require("@fjhb/lm-redis");
const gameBiz       = require("@fjhb/db-op").red_envelope_game;
const gameResultBiz = require("@fjhb/db-op").red_envelope_game_result;
const roomBiz       = require("@fjhb/db-op").room;
const { Decimal }   = require("decimal.js");

// /**
//  *
//  * 获取 game 的key
//  * @param {number|string} game_id
//  * @returns {string}
//  */
// function getGameKey(game_id){
//     return `lm:game:${game_id}`;
// }

/**
 * 获取game的信息
 *
 * @param {number} gameId
 * @returns {Promise<object>}
 */
async function getGame(gameId){
    // var key = getGameKey(gameId); //`lm:game:${gameId}`;
    // var game = await redis.hgetall(key); //注意, hgetall key对应的value不存在时, 返回的是 {} . 而不是 null.
    // if( game["game_id"] == null ){
    //     logger.debug(`缓存里没有 ${key} 对应的game 信息。从数据库获取`);
    //     game = await gameBiz.get_by_gameid(gameId);
    //     if(game != null){
    //         await redis.hmset(key, game);//todo: 暂时 不过期
    //     }
    //     else{
    //         throw new Error(`不存在 [${gameId}] 对应的 red_envelope_game 记录`);
    //     }
    // }
    let game = await gameBiz.get_by_gameid(gameId);
    return game;
}

/**
 *  更新 game 的 left_count 字段. 包括 数据库 和 缓存 都要更新.
 *
 * @param {number} game_id    游戏 id
 * @param {number} left_count 要更新为的 剩余 数量
 */
async function update_game_left_count(game_id , left_count){
    //game 的 left_amount 也要更新 ，同时缓存也要更新
    await gameBiz.update_left_count(game_id , left_count);
    // var key = getGameKey(game_id); 
    // await redis.hset(key , "left_count" , left_count);
}


/**
 * 获取 gameResult信息。
 *
 * @param {number} gameId
 * @returns {Promise<GameResult[]>}
 */
async function getGameResult(gameId){
    // let gameResultAry = await getGameResultFromRedis(gameId);
    // logger.debug(`gameResultAry.length:${gameResultAry.length}`);
    // if(gameResultAry == null){
    //     //redis 里没有， 那么从数据里获取
    //     gameResultAry = await gameResultBiz.getByGameId(gameId);
    //     logger.debug(`从数据库里获取 game_id:${gameId} 的 gameResult:${JSON.stringify(gameResultAry)}`);
    //     await setGameResultListToRedis(gameResultAry);
    // }
    let gameResultAry = await gameResultBiz.getByGameId(gameId);
    return gameResultAry;    
}

/**
 * @typedef GameResult red_envelope_game_result表
 * @property {number} id
 * @property {number} game_id
 * @property {string} account_name
 * @property {Date} create_time
 * @property {number} transfer_amount
 * @property {number} amount
 * @property {string} balance_type
 */

// /**
//  * 设置 gameResult 数组 的缓存
//  * @param {object[]} gameResultAry
//  */
// async function setGameResultListToRedis(gameResultAry) {
//     for (let idx = 0; idx < gameResultAry.length; idx++) {
//         const gameResult = gameResultAry[idx];
//         setGameResultToRedis(gameResult);
//     }
// }

/**
 * 添加一个 gameResult .(数据库 以及 缓存)
 * @param {object} gameResult
 */
async function addGameResult(gameResult){
    //插入 gameResult
    await gameResultBiz.create(gameResult);
    logger.debug(`red_envelope_game_result created.`,gameResult);
    // //插入 gameResult 缓存
    // await setGameResultToRedis(gameResult);
}

// /**
//  * 获取 gameResult 的 缓存 key
//  *
//  * @param {string|number} gameId
//  * @param {string|number} resultId
//  * @returns {string}
//  */
// function getGameResultRedisKey(gameId, resultId){
//     return `lm:game_result:${gameId}:${resultId}`
// }


/**
 * @typedef Offer 链上的 offer 表的结构
 * @property {number} snatch_id  红包游戏结果id(game_result_id)
 * @property {number} packet_id  红包游戏id(game_id)
 * @property {string} name     用户名
 * @property {string} amount 类似: 1.7694 EOS
 */

/**
 * 更新 gameResult 表里 result_id  对应的  记录 的 amount 字段的值。
 * 然后 更新 redis 里， 此 result 的 amount 的值。
 * 
 *
 */


/**
 * 更新 gameResult 表里的 result_id 对应记录的 amount 字段的值
 * @param {number} game_result_id 游戏结果id
 * @param {string} amountStr 数量字符串
 * @param {string} tx_id 链操作id
 */
async function updateGameResultAmount(game_result_id , amountStr , tx_id){
    //更新 red_envelope_game_result 表对应主键的 amount 字段。
    //let [ amountStr , symbol ] = gameResult.amount.split(' ');
    // let game_id = gameResult.packet_id ;  // 即 红包id
    // let game_result_id = gameResult.snatch_id;  //即 game_result_id
    var amount = new Decimal(amountStr).toNumber();
    //var id = parseInt( snatch_id );
    //更新数据库
    var flag = await gameResultBiz.updateAmount(game_result_id ,amount ,tx_id);
    // if(flag){
    //     //设置缓存的 对应 值的 amount 字段。
    //     let key = getGameResultRedisKey(game_id , game_result_id);
    //     await redis.hset(key, "amount" , amount);
    //     logger.debug(`更新 key:${key} 的amount 为 :${amount}`);
    // }
    logger.debug(`更新 game_id:${game_result_id} 的 amount:${amount}`);
}

// /**
//  * 设置一个数据到 缓存
//  *
//  * @param {*} gameResult
//  */
// async function setGameResultToRedis(gameResult){
//     var key = getGameResultRedisKey(gameResult.game_id, gameResult.id) //`lm:game_result:${gameResult.game_id}:${gameResult.id}`
//     await redis.hmset(key, gameResult);
//     logger.debug(`setGameResultToRedis. key:${key}`);
// }

// /**
//  * 从 redis 里获取某一期游戏的所有结果
//  * @param {number} gameId
//  * @returns {Promise<object[]>}
//  */
// async function getGameResultFromRedis(gameId) {
//     const keyPattern = `lm:game_result:${gameId}:*`;
//     let ary = [];
//     //获取所有的key ， 然后把这些key对应的 hash 组成一个数组
//     const gameResultKeys = await redis.keys(keyPattern); //todo:暂时 不过期
//     if(gameResultKeys.length == 0){
//         return [];
//     }

//     for (let idx = 0; idx < gameResultKeys.length; idx++) {
//         const key = gameResultKeys[idx];
//         var gameResult = await redis.hgetall(key);
//         if(gameResult["id"]){
//             ary.push(gameResult);
//         }
//     }
//     return ary;
// }

/**
 *
 *
 * @param {number} room_id
 * @returns
 */
async function getRoom(room_id){
    // let roomKey = getRoomKey(room_id);
    // var room = await redis.hgetall(roomKey);
    // if(room["room_id"] == null){
    //     room = await getRoomFromDb( room_id);
    //     if(room != null){
    //         redis.hmset(roomKey , room)
    //     }
    //     else{
    //         logger.error(`${room_id} 对应的 room 不存在 。`);
    //     }
    // }
    let room = await getRoomFromDb( room_id);
    return room;
}

// function getRoomKey(room_id){
//     return `lm:room:${room_id}`;
// }

async function getRoomFromDb(room_id){
    return roomBiz.get_by_room_id(room_id);
}

/**
 * 获取 下一个 gameId
 *
 * @returns {Promise<number>}
 */
async function getNextGameId() {
    let next_game_id = await redis.incr("lm:game:next_game_id");
    return next_game_id;
}

module.exports = { 
    getGame , getGameResult , updateGameResultAmount ,addGameResult , getRoom ,update_game_left_count ,getNextGameId
}