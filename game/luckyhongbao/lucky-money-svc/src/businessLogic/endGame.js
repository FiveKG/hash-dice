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

endGame(1)

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

        // let allDbOpAry = [];
        //按照 用户 来处理。先拿出每个用户的余额，然后在这个余额的基础上， 计算此用户的账户余额变动的日志。

        //拿出涉及到的所有用户的 账户余额。 包括 代理的账户
        // let allAccountName = gameResultAry.map(t => { return t.account_name });
        // logger.debug(`allAccountName: `, allAccountName);
        //当前游戏用户的 代理信息。
        // allAccountName = Array.from(new Set(allAccountName)); //去重

        // // 获取用户彩码，游戏码，余额
        // const TBG_SERVER = process.env.TBG_SERVER || "http://localhost:9527/";
        // const opts = { data: { account_name: allAccountName.join(",") } };
        // const { data: resp } = await xhr.get(url.resolve(TBG_SERVER, "/balance/game_balance"), opts);
        // logger.debug("resp: ", resp);
        // //计算每个用户的账户变动信息

        // let allAccountBalanceInfo = {};
        // for (let balanceInfo of resp) {
        //     allAccountBalanceInfo[balanceInfo.account_name] = {
        //         "current_balance": Number(balanceInfo.balance),
        //         "origin_balance": Number(balanceInfo.balance)
        //     };
        // }

        // logger.debug(`allAccountBalanceInfo: ${JSON.stringify(allAccountBalanceInfo)}`);
        let symbolTransferList = [];
        //首先 , 对 other_game_result 用户进行 预扣除的金额的退款
        for (let idx = 0; idx < other_game_result.length; idx++) {
            const gameResult = other_game_result[idx];
            //拿出这个账户的余额，生成数据库的操作信息
            // let accountBalanceInfo = allAccountBalanceInfo[gameResult.account_name];
            // logger.debug(`debug_balance ${gameResult.account_name} 抵押退还 前 ${accountBalanceInfo.current_balance} , 要增加 ${gameResult.transfer_amount} `);
            // let result_balance = Decimal.add(accountBalanceInfo.current_balance, gameResult.transfer_amount);

            // allDbOpAry.push({
            //     "sql": "insert into account_balance_log(account_name , change_amount ,current_balance , op_type , remark , create_time ) values ($account_name , $change_amount , $current_balance , $op_type , $remark , $create_time)",
            //     "bind": {
            //         "account_name": gameResult.account_name,
            //         "change_amount": gameResult.transfer_amount,//预扣除的金额
            //         "current_balance": result_balance.toNumber(),
            //         "op_type": "抵押退还",
            //         "remark": `退还参与游戏:${gameResult.game_id}抵押的 :${gameResult.transfer_amount} UE .`,
            //         "create_time": new Date()
            //     },
            //     "type": dbOp.db.Sequelize.QueryTypes.INSERT
            // });
            // accountBalanceInfo.current_balance = result_balance.toNumber();  //每次生成  update eos_account balance 的操作， 都把最新的余额，更新到 缓存中
            // logger.debug(`debug_balance 抵押退还 后，${gameResult.account_name}  余额 ${accountBalanceInfo.current_balance}`);

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
                    "memo": `用户使用抢红包，退还余额`
                };
                logger.debug(`用户使用抢红包，退还余额, %j`, transferInfo);

                symbolTransferList.push(transferInfo);
            }
        }

        // //更新每个 用户 抢到的 余额
        // for (let idx = 0; idx < gameResultAry.length; idx++) {
        //     const gameResult = gameResultAry[idx];
        //     //拿出这个账户的余额，生成数据库的操作信息
        //     let accountBalanceInfo = allAccountBalanceInfo[gameResult.account_name];
        //     logger.debug(`debug_balance ${gameResult.account_name} 抢到的金额 前 ${accountBalanceInfo.current_balance} , 要增加 ${gameResult.amount} `);
        //     let result_balance = Decimal.add(accountBalanceInfo.current_balance, gameResult.amount);

        //     allDbOpAry.push({
        //         "sql": "insert into account_balance_log(account_name , change_amount ,current_balance , op_type , remark , create_time ) values ($account_name , $change_amount , $current_balance , $op_type , $remark , $create_time)",
        //         "bind": {
        //             "account_name": gameResult.account_name,
        //             "change_amount": gameResult.amount,//抢到的金额
        //             "current_balance": result_balance.toNumber(),
        //             "op_type": "抢到的金额",
        //             "remark": `游戏 ${game_id} ,抢到了:${gameResult.amount} UE.`,
        //             "create_time": new Date()
        //         },
        //         "type": dbOp.db.Sequelize.QueryTypes.INSERT
        //     });
        //     accountBalanceInfo.current_balance = result_balance.toNumber();  //每次生成  update eos_account balance 的操作， 都把最新的余额，更新到 缓存中
        //     logger.debug(`debug_balance 抢到的金额 后，${gameResult.account_name} 余额 ${accountBalanceInfo.current_balance}`);
        // }

        // //最后，每个用户，写一条 最终的 余额更新 数据库操作 以及 系统的余额更新操作。
        // for (let accountName in allAccountBalanceInfo) {
        //     let accountBalanceInfo = allAccountBalanceInfo[accountName];
        //     if (accountBalanceInfo.current_balance !== accountBalanceInfo.origin_balance) {
        //         logger.debug(`debug_balance 最终 ${accountName} 余额 ${accountBalanceInfo.current_balance}`);
        //         allDbOpAry.push({
        //             "sql": "update eos_account set balance = $new_balance where account_name = $account_name",
        //             "bind": { "new_balance": accountBalanceInfo.current_balance, "account_name": accountName },
        //             "type": dbOp.db.Sequelize.QueryTypes.UPDATE
        //         });
        //     } else {
        //         logger.info(`在本轮游戏game_id:${game_id} 期间，${accountName} 的余额没有变化。`);
        //     }
        // }

        logger.debug(`symbolTransferList: ${JSON.stringify(symbolTransferList)}`);
        if (symbolTransferList.length !== 0) {
            await symbolTransfer.push(symbolTransferList);
            symbolTransferList = null;
        }

        // logger.debug(`执行 结束游戏时的 批量数据库事务操作. game_id:${game_id}. allDbOpAry:${JSON.stringify(allDbOpAry)}`);
        // db_op_flag = await dbOp.batch_trans_db_op(allDbOpAry);
        // logger.debug(`结束游戏时的 批量数据库事务操作. game_id:${game_id}。db_op_flag：${db_op_flag}`);

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
