//@ts-check
// require("../initEnv.js")();
const logger = require("@fjhb/logger").child({ "@": "lucky_money_svc/businessLogic/endGame" });
const gameManager = require("../common/gameManager.js");
const { isBefore, isAfter } = require("date-fns");
const sysConfig = require("../common/sysConfig.js");
const dbOp = require("@fjhb/db-op");
const { Decimal } = require("decimal.js");
const uuid = require("uuid/v4");
const { startNewGame, notify_game_end } = require("@fjhb/mq-pub-sub");
const { symbolTransfer } = require("../common/redis_queue");
const redis = require("@fjhb/lm-redis");
const url = require("url");
const xhr = require("../common/xhr")
const psModifyBalance = require("../common/psModifyBalance");

// endGame(1)

/**
 * 结束游戏
 *
 * @param {number} game_id
 */
async function endGame(game_id) {
    let db_op_flag = false;
    try {
        logger.debug(`endGame(结束游戏). game_id: ${game_id}`);
        var gameResultAry = await gameManager.getGameResult(game_id);
        gameResultAry.sort(compareByAmount);//排序之后， 最大的在最后面

        var max_game_result = gameResultAry[gameResultAry.length - 1];
        logger.debug(`在 ${game_id} 游戏里, ${max_game_result.account_name}抢到的最多. 下一轮由${max_game_result.account_name} 发红包. :`, max_game_result);

        var other_game_result = gameResultAry.filter(t => { return t.id != max_game_result.id });
        logger.debug(`other_game_result:`, other_game_result);

        let game = await gameManager.getGame(game_id);
        let room = await gameManager.getRoom(game.room_id);//注意 room_id 小于 200 ， 是官方俱乐部的房间
        logger.debug(`endGame. 当前要结束game: ${JSON.stringify(game)} . room:${JSON.stringify(room)}`);

        let symbolTransferList = [];
        //首先 , 对 other_game_result 用户进行 预扣除的金额的退款
        for (let idx = 0; idx < other_game_result.length; idx++) {
            const gameResult = other_game_result[idx];
            // 如果直接使用区块链 UE 代币投注，不需要扣除用户的数据库余额
            if (gameResult.balance_type !== "transfer") {
                await psModifyBalance.pub({
                    game_type: "luckyhongbao",
                    account_name: gameResult.account_name,
                    change_amount: gameResult.transfer_amount,
                    pay_type: gameResult.balance_type
                })
            } else {
                const transferInfo = {
                    "account_name": gameResult.account_name,
                    "amount": gameResult.transfer_amount,
                    "symbol": "UE",
                    "memo": `用户使用余额抢红包，退还余额`,
                    "opts": "returns"
                };
                logger.debug(`用户使用余额抢红包，退还余额, %j`, transferInfo);

                symbolTransferList.push(transferInfo);
            }
        }

        logger.debug(`symbolTransferList: ${JSON.stringify(symbolTransferList)}`);
        if (symbolTransferList.length !== 0) {
            await symbolTransfer.push(symbolTransferList);
            symbolTransferList = null;
        }

        //// 中奖的 max_game_result 信息里， 发布开始新游戏的事件
        var msg = {
            "room_id": room.room_id,
            "account_name": max_game_result.account_name,
            "amount": room.amount,
            "isRoomFirstGame": false,                //当前要开始的游戏，不是房间的第一个游戏
            "quantity": room.quantity,
            "balance_type": max_game_result.balance_type, //"transfer", 抢的时候, 是什么,意味着新游戏就是用什么类型的余额
            "symbol": "UE"          //默认是 EOS 
        };
        logger.debug(`startNewGame msg:`, msg);
        await startNewGame.pub(msg);
        logger.debug(`startNewGame.pub 完成.`);


        //再按照 时间排一下序, 后抢的,在前面. 用于发布游戏结束的时间.
        gameResultAry.sort(compareByCreateTime);  //排序之后，最后面的在最前面
        var notify_game_end_message = {
            "endTime": gameResultAry[gameResultAry.length - 1].create_time,
            "gameChainBlockId": "",
            "game_id": game_id,
            "nextSender": max_game_result.account_name,
            "results": gameResultAry.map(t => { return { "amount": t.amount, "account_name": t.account_name } }),
            "room_id": room.room_id,
            "total_count": room.quantity,
            "left_count": 0,
            "account_name": game.account_name,
            "startTime": gameResultAry[0].create_time
        };
        logger.debug(`notify_game_end.msg :`, notify_game_end_message);
        await notify_game_end.pub(notify_game_end_message);
        logger.debug(`notify_game_end.pub 完成.`);

        // 清理 redis 的 game_result_amount:${nextGameId}
        await redis.del(`game_result_amount:${game_id}`);
    } catch (error) {
        logger.error(`endGame 时出错。当前 db_op_flag:${db_op_flag}. `, error.message, error.stack);
    }
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

/**
 * 比较 两个 gameResult
 *
 * @param {GameResult} a_gameResult
 * @param {GameResult} b_gameResult
 * @returns
 */
function compareByAmount(a_gameResult, b_gameResult) {
    if (new Decimal(a_gameResult.amount).lessThan(b_gameResult.amount)) {
        return -1;
    }

    if (new Decimal(a_gameResult.amount).greaterThan(b_gameResult.amount)) {
        return 1;
    }
    return 0;
}

/**
 * 根据create_time 比较 两个 gameResult.
 *
 * @param {GameResult} a_gameResult
 * @param {GameResult} b_gameResult
 * @returns
 */
function compareByCreateTime(a_gameResult, b_gameResult) {
    if (isBefore(a_gameResult.create_time, b_gameResult.create_time)) {
        return -1;
    }
    if (isAfter(a_gameResult.create_time, b_gameResult.create_time)) {
        return 1;
    }
    return 0;
}

/**
 * 延迟 指定的毫秒数
 *
 * @param {number} msNbr
 * @returns {Promise<void>}
 */
function delay(msNbr) {
    var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, msNbr);
    })
    return promise;
}

module.exports = endGame;
