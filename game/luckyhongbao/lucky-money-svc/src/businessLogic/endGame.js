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
        logger.debug(`在 ${game_id} 游戏里, ${max_game_result.account_name}抢到的最多. 下一轮由${max_game_result.account_name} 发红包. :`, JSON.stringify(max_game_result));

        var other_game_result = gameResultAry.filter(t => { return t.id != max_game_result.id });
        logger.debug(`other_game_result:`, JSON.stringify(other_game_result));

        let game = await gameManager.getGame(game_id);
        let room = await gameManager.getRoom(game.room_id);//注意 room_id 小于 200 ， 是官方俱乐部的房间
        logger.debug(`endGame. 当前要结束game: ${JSON.stringify(game)} . room:${JSON.stringify(room)}`);

        let club_info = await dbOp.club.get_club_by_room(room.room_id);
/**/    let airDropConfig = await sysConfig.coin_air_drop_config.get();

        let allDbOpAry = [];
        //按照 用户 来处理。先拿出每个用户的余额，然后在这个余额的基础上， 计算此用户的账户余额变动的日志。

        //拿出涉及到的所有用户的 账户余额。 包括 代理的账户
        let allAccountName = gameResultAry.map(t => { return t.account_name });

        //当前游戏用户的 代理信息。
        allAccountName = Array.from(new Set(allAccountName)); //去重
        //获取所有相关的用户的余额信息
        let tmpAllAccountBalance = await dbOp.eos_account.get_account_balance(allAccountName);
        let allAccountBalanceInfo = {};
        for (let balanceInfo of tmpAllAccountBalance) {
            allAccountBalanceInfo[balanceInfo.account_name] = {
                "current_balance": Number(balanceInfo.balance),
                "origin_balance": Number(balanceInfo.balance)
            };
        }

        logger.debug(`allAccountBalanceInfo: ${JSON.stringify(allAccountBalanceInfo)}`);

        //计算每个用户的账户变动信息
        //首先 , 对 other_game_result 用户进行 预扣除的金额的退款
        for (let idx = 0; idx < other_game_result.length; idx++) {
            const gameResult = other_game_result[idx];
            //拿出这个账户的余额，生成数据库的操作信息
            let accountBalanceInfo = allAccountBalanceInfo[gameResult.account_name];
            logger.debug(`debug_balance ${gameResult.account_name} 抵押退还 前 ${accountBalanceInfo.current_balance} , 要增加 ${gameResult.transfer_amount} `);
            let result_balance = Decimal.add(accountBalanceInfo.current_balance, gameResult.transfer_amount);

            allDbOpAry.push({
                "sql": "insert into account_balance_log(account_name , change_amount ,current_balance , op_type , remark , create_time ) values ($account_name , $change_amount , $current_balance , $op_type , $remark , $create_time)",
                "bind": {
                    "account_name": gameResult.account_name,
                    "change_amount": gameResult.transfer_amount,//预扣除的金额
                    "current_balance": result_balance.toNumber(),
                    "op_type": "抵押退还",
                    "remark": `退还参与游戏:${gameResult.game_id}抵押的 :${gameResult.transfer_amount} POG .`,
                    "create_time": new Date()
                },
                "type": dbOp.db.Sequelize.QueryTypes.INSERT
            });
            accountBalanceInfo.current_balance = result_balance.toNumber();  //每次生成  update eos_account balance 的操作， 都把最新的余额，更新到 缓存中
            logger.debug(`debug_balance 抵押退还 后，${gameResult.account_name}  余额 ${accountBalanceInfo.current_balance}`);
        }

        //更新每个 用户 抢到的 余额
        for (let idx = 0; idx < gameResultAry.length; idx++) {
            const gameResult = gameResultAry[idx];
            //拿出这个账户的余额，生成数据库的操作信息
            let accountBalanceInfo = allAccountBalanceInfo[gameResult.account_name];
            logger.debug(`debug_balance ${gameResult.account_name} 抢到的金额 前 ${accountBalanceInfo.current_balance} , 要增加 ${gameResult.amount} `);
            let result_balance = Decimal.add(accountBalanceInfo.current_balance, gameResult.amount);

            allDbOpAry.push({
                "sql": "insert into account_balance_log(account_name , change_amount ,current_balance , op_type , remark , create_time ) values ($account_name , $change_amount , $current_balance , $op_type , $remark , $create_time)",
                "bind": {
                    "account_name": gameResult.account_name,
                    "change_amount": gameResult.amount,//抢到的金额
                    "current_balance": result_balance.toNumber(),
                    "op_type": "抢到的金额",
                    "remark": `游戏 ${game_id} ,抢到了:${gameResult.amount} POG.`,
                    "create_time": new Date()
                },
                "type": dbOp.db.Sequelize.QueryTypes.INSERT
            });
            accountBalanceInfo.current_balance = result_balance.toNumber();  //每次生成  update eos_account balance 的操作， 都把最新的余额，更新到 缓存中
            logger.debug(`debug_balance 抢到的金额 后，${gameResult.account_name} 余额 ${accountBalanceInfo.current_balance}`);
        }

        /********************** 空投逻辑 开始 **********************/
        // 1. 将 空投 信息 放入到 redis 的队列中, 用专门的进程去处理这种代币的转账操作
        // 2. 写 system_symbol_log (系统代币变动记录) 记录
        // 如果不是官方俱乐部, 那么空投给 俱乐部创建者 金额 , 红包金额 * 比例
        // 注意: toFixed(4) 会进行四舍五入, 也就是大于等于 0.00005 就会变成 0.0001, 小于 0.00005 就会变成 0.0000
        let symbolTransferList = [];
        if (club_info.club_id !== 1) {
            const airdrop_amount = Number(Decimal.mul(airDropConfig.commonClub.clubOwner.rate, room.amount).toFixed(4));

            if (airdrop_amount > 0) {
                const transferInfo = {
                    "account_name": club_info.creator_name,
                    "amount": airdrop_amount,
                    "symbol": airDropConfig.commonClub.clubOwner.symbol,
                    "memo": `airdrop to the club creator, club ID is ${club_info.club_id}`
                };
                logger.debug(`代币空投, 空投给俱乐部创建者, %j`, transferInfo);

                symbolTransferList.push(transferInfo);

                allDbOpAry.push({
                    "sql": "insert into system_symbol_log(id, account_name, symbol, amount, log_type, create_time, extra_info, remark) values ($id, $account_name, $symbol, $amount, $log_type, $create_time, $extra_info, $remark)",
                    "bind": {
                        "id": uuid(),
                        "account_name": club_info.creator_name,
                        "symbol": airDropConfig.commonClub.clubOwner.symbol,
                        "amount": airdrop_amount,
                        "log_type": "airdrop",
                        "create_time": new Date(),
                        "extra_info": { "club_id": club_info.club_id, "room_id": room.room_id, "game_id": game.game_id, "type": "club_creator" },
                        "remark": `在俱乐部房间里抢红包, 给予该俱乐部创建者 ${club_info.creator_name} 系统空投. quantity: [${airdrop_amount} ${airDropConfig.commonClub.clubOwner.symbol}].`
                    },
                    "type": dbOp.db.Sequelize.QueryTypes.INSERT
                });
            }
        }
        // 其他人, 红包金额 * 比例
        for (let other_game_result_info of other_game_result) {
            const other_airdrop_amount = Number(Decimal.mul(airDropConfig.officialClub.otherUser.rate, room.amount).toFixed(4));

            if (other_airdrop_amount > 0) {
                const transferInfo = {
                    "account_name": other_game_result_info.account_name,
                    "amount": other_airdrop_amount,
                    "symbol": airDropConfig.officialClub.otherUser.symbol,
                    "memo": `airdrop to the user who grabs the red envelope, red envelope ID is ${game.game_id}`
                };
                logger.debug(`代币空投, 空投给抢红包的用户, %j`, transferInfo);

                symbolTransferList.push(transferInfo);

                allDbOpAry.push({
                    "sql": "insert into system_symbol_log(id, account_name, symbol, amount, log_type, create_time, extra_info, remark) values ($id, $account_name, $symbol, $amount, $log_type, $create_time, $extra_info, $remark)",
                    "bind": {
                        "id": uuid(),
                        "account_name": other_game_result_info.account_name,
                        "symbol": airDropConfig.officialClub.otherUser.symbol,
                        "amount": other_airdrop_amount,
                        "log_type": "airdrop",
                        "create_time": new Date(),
                        "extra_info": { "club_id": club_info.club_id, "room_id": room.room_id, "game_id": game.game_id, "game_result_id": other_game_result_info.id, "type": "grab" },
                        "remark": `用户 ${other_game_result_info.account_name} 在俱乐部房间里抢红包 ${other_game_result_info.amount}, 系统空投. quantity: [${other_airdrop_amount} ${airDropConfig.officialClub.otherUser.symbol}].`
                    },
                    "type": dbOp.db.Sequelize.QueryTypes.INSERT
                });
            }
        }
        // 抢的最多的人, 红包金额 * 比例
        const max_airdrop_amount = Number(Decimal.mul(airDropConfig.officialClub.maxGrabUser.rate, room.amount).toFixed(4));
        if (max_airdrop_amount > 0) {  // 如果抢的最多的人 需要返利
            const transferInfo = {
                "account_name": max_game_result.account_name,
                "amount": max_airdrop_amount,
                "symbol": airDropConfig.officialClub.maxGrabUser.symbol,
                "memo": `airdrop to the user who grabs the biggest red envelope, red envelope ID is ${game.game_id}`
            };
            logger.debug(`代币空投, 空投给抢最大红包的用户, %j`, transferInfo);

            symbolTransferList.push(transferInfo);

            allDbOpAry.push({
                "sql": "insert into system_symbol_log(id, account_name, symbol, amount, log_type, create_time, extra_info, remark) values ($id, $account_name, $symbol, $amount, $log_type, $create_time, $extra_info, $remark)",
                "bind": {
                    "id": uuid(),
                    "account_name": max_game_result.account_name,
                    "symbol": airDropConfig.officialClub.maxGrabUser.symbol,
                    "amount": max_airdrop_amount,
                    "log_type": "airdrop",
                    "create_time": new Date(),
                    "extra_info": { "club_id": club_info.club_id, "room_id": room.room_id, "game_id": game.game_id, "game_result_id": max_game_result.id, "type": "max_grab" },
                    "remark": `用户 ${max_game_result.account_name} 在俱乐部房间里抢到最大的红包 ${max_game_result.amount}, 系统空投. quantity: [${max_airdrop_amount} ${airDropConfig.officialClub.maxGrabUser.symbol}].`
                },
                "type": dbOp.db.Sequelize.QueryTypes.INSERT
            });
        }
        // 抢的最多的人的推荐者, 红包金额 * 比例
        const refer = await dbOp.account_refer.get_by_account_name(max_game_result.account_name);
        if (refer) {
            const airdrop_amount = Number(Decimal.mul(airDropConfig.officialClub.referUser.rate, room.amount).toFixed(4));

            if (airdrop_amount > 0) {
                const transferInfo = {
                    "account_name": refer.refer_name,
                    "amount": airdrop_amount,
                    "symbol": airDropConfig.officialClub.referUser.symbol,
                    "memo": `airdrop to the recommender of the user who grabs the biggest red envelope, red envelope ID is ${game.game_id}`
                };
                logger.debug(`代币空投, 空投给抢最大红包的用户的推荐者, %j`, transferInfo);

                symbolTransferList.push(transferInfo);

                allDbOpAry.push({
                    "sql": "insert into system_symbol_log(id, account_name, symbol, amount, log_type, create_time, extra_info, remark) values ($id, $account_name, $symbol, $amount, $log_type, $create_time, $extra_info, $remark)",
                    "bind": {
                        "id": uuid(),
                        "account_name": refer.refer_name,
                        "symbol": airDropConfig.officialClub.referUser.symbol,
                        "amount": airdrop_amount,
                        "log_type": "airdrop",
                        "create_time": new Date(),
                        "extra_info": { "club_id": club_info.club_id, "room_id": room.room_id, "game_id": game.game_id, "type": "refer" },
                        "remark": `由于 用户 ${max_game_result.account_name} 在俱乐部房间里抢到最大的红包, 所以此用户的推荐者 ${refer.refer_name} 获得系统空投. quantity: [${airdrop_amount} ${airDropConfig.officialClub.referUser.symbol}].`
                    },
                    "type": dbOp.db.Sequelize.QueryTypes.INSERT
                });
            }
        }
        /********************** 空投逻辑 结束 **********************/

        //最后，每个用户，写一条 最终的 余额更新 数据库操作 以及 系统的余额更新操作。
        for (let accountName in allAccountBalanceInfo) {
            let accountBalanceInfo = allAccountBalanceInfo[accountName];
            if (accountBalanceInfo.current_balance !== accountBalanceInfo.origin_balance) {
                logger.debug(`debug_balance 最终 ${accountName} 余额 ${accountBalanceInfo.current_balance}`);
                allDbOpAry.push({
                    "sql": "update eos_account set balance = $new_balance where account_name = $account_name",
                    "bind": { "new_balance": accountBalanceInfo.current_balance, "account_name": accountName },
                    "type": dbOp.db.Sequelize.QueryTypes.UPDATE
                });
            } else {
                logger.info(`在本轮游戏game_id:${game_id} 期间，${accountName} 的余额没有变化。`);
            }
        }

        logger.debug(`执行 结束游戏时的 批量数据库事务操作. game_id:${game_id}. allDbOpAry:${JSON.stringify(allDbOpAry)}`);
        db_op_flag = await dbOp.batch_trans_db_op(allDbOpAry);
        logger.debug(`结束游戏时的 批量数据库事务操作. game_id:${game_id}。db_op_flag：${db_op_flag}`);

        logger.debug(`发布 空投 事件, symbolTransferList: ${JSON.stringify(symbolTransferList)}`);
        await symbolTransfer.push(symbolTransferList);
        symbolTransferList = null;
        logger.debug(`发布 空投 事件完成`);

        //// 中奖的 max_game_result 信息里， 发布开始新游戏的事件
        var msg = {
            "room_id": room.room_id,
            "account_name": max_game_result.account_name,
            "amount": room.amount,
            "isRoomFirstGame": false,                //当前要开始的游戏，不是房间的第一个游戏
            "quantity": room.quantity,
            "balance_type": max_game_result.balance_type, //"transfer", 抢的时候, 是什么,意味着新游戏就是用什么类型的余额
            "symbol": "POG"          //默认是 EOS 
        };
        logger.debug(`startNewGame msg:`, JSON.stringify(msg));
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
        logger.debug(`notify_game_end.msg :`, JSON.stringify(notify_game_end_message));
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
