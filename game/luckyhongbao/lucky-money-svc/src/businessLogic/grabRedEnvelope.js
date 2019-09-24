//@ts-check
// require("../initEnv.js")();
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "grabRedEnvelope" });
const chainOperate = require("../common/chainOperate.js");
const { parse } = require("date-fns");
const { Decimal } = require("decimal.js");
const zero = new Decimal(0);
const { endGame, notify_user_grab_red_envelope } = require("@fjhb/mq-pub-sub");
const { db } = require("@fjhb/db-op");
const padStart = require("../common/padStart.js");
const redis = require("@fjhb/lm-redis");
const Redlock = require("redlock");
const { generate } = require("shortid");
const psModifyBalance = require("../common/psModifyBalance");

const redlock = new Redlock([redis], {
    retryCount: -1,
    retryDelay: 500, // time in ms
    retryJitter: 300 // time in ms
});

/**
 *  处理用户抢红包的逻辑
 * @param {GrabRedEnvelopeArgv} data
 */
async function grabRedEnvelope(data) {
    try {
        const startTime = Date.now();
        logger.debug(`执行抢红包操作, data: ${JSON.stringify(data)}, beginning....`);

        const balance_type_ary = ["withdraw_enable", "game_currency", "transfer"];
        if (balance_type_ary.indexOf(data.balance_type) == -1) {
            logger.warn(`抢红包时,不合法的 balance_type:${data.balance_type}`);
            return;
        }

        const lock_key = `grab:${data.roomId}`;
        const lock = await redlock.lock(lock_key, 3000);
        const trans = await db.sequelize.transaction();  // 启动事务
        logger.debug(`用户 ${data.accountName} 抢红包, 获取锁 key: ${lock.resource}, value: ${lock.value}, 开始pg事务`);

        try {
            const gameInfo = await db.sequelize.query(`
                SELECT * 
                FROM red_envelope_game 
                WHERE room_id = ${data.roomId} 
                ORDER BY create_time DESC 
                LIMIT 1
                FOR UPDATE;`, {
                    transaction: trans,
                    type: "SELECT",
                    plain: true
                }
            );

            if (gameInfo == null) {
                const grabResult = {
                    "game_id": -1,
                    "room_id": data.roomId,
                    "is_success": false,
                    "amount": `${data.transferAmount} UE`,
                    "remark": "此红包已抢完",
                    "account_name": data.accountName
                };

                logger.info(`发送通知 消息, ${JSON.stringify(grabResult)}`);
                await notify_user_grab_red_envelope.pub(grabResult);

                throw new Error(`无法获取到房间 ${data.roomId} 最新的红包`);
            }
            if (Number(gameInfo.left_count) === 0) {
                const grabResult = {
                    "game_id": gameInfo.game_id,
                    "room_id": data.roomId,
                    "is_success": false,
                    "amount": `${data.transferAmount} UE`,
                    "remark": "此红包已抢完",
                    "account_name": data.accountName
                };

                logger.info(`发送通知 消息, ${JSON.stringify(grabResult)}`);
                await notify_user_grab_red_envelope.pub(grabResult);

                throw new Error(`红包已经抢完了, 剩余数量为 ${gameInfo.left_count}`)
            }

            //拿出 当前 此 game 的所有的 gameResult
            const gameResultAry = await db.sequelize.query(`
                SELECT * 
                FROM red_envelope_game_result 
                WHERE game_id = ${gameInfo.game_id} 
                ORDER BY id ASC;`, {
                    type: "SELECT",
                    transaction: trans
                }
            );

            const roomInfo = await db.room.findOne({ "where": { "room_id": data.roomId, "is_enable": true }, "raw": true, "transaction": trans });
            if (roomInfo == null) {
                const grabResult = {
                    "game_id": gameInfo.game_id,
                    "room_id": data.roomId,
                    "is_success": false,
                    "amount": `${data.transferAmount} UE`,
                    "remark": "红包房间不存在",
                    "account_name": data.accountName
                };

                logger.info(`发送通知 消息, ${JSON.stringify(grabResult)}`);
                await notify_user_grab_red_envelope.pub(grabResult);

                throw new Error(`房间 ${data.roomId} 不存在, 但触发了抢红包操作`);
            }
            if (Number(roomInfo.amount) !== Number(data.transferAmount)) {
                const grabResult = {
                    "game_id": gameInfo.game_id,
                    "room_id": data.roomId,
                    "is_success": false,
                    "amount": `${data.transferAmount} UE`,
                    "remark": `转账金额${data.transferAmount} 与room: ${roomInfo.amount}的规则不一致`,
                    "account_name": data.accountName
                };

                logger.info(`发送通知 消息, ${JSON.stringify(grabResult)}`);
                await notify_user_grab_red_envelope.pub(grabResult);

                throw new Error(`转账金额 ${data.transferAmount} 与房间规定金额 ${roomInfo.amount} 不一致, 但触发了抢红包操作`);
            }

            const userGameResultInfo = gameResultAry.find(t => { return t.account_name == data.accountName && Number(t.amount) > 0 });
            if (userGameResultInfo) {
                const grabResult = {
                    "game_id": gameInfo.game_id,
                    "room_id": data.roomId,
                    "is_success": false,
                    "amount": `${data.transferAmount} UE`,
                    "remark": `已经抢过此红包`,
                    "account_name": data.accountName
                };

                logger.info(`发送通知 消息, ${JSON.stringify(grabResult)}`);
                await notify_user_grab_red_envelope.pub(grabResult);

                throw new Error(`用户 ${data.accountName} 已经抢过此红包 ${gameInfo.game_id}`);
            }

            // 如果直接使用区块链 UE 代币投注，不需要扣除用户的数据库余额
            if (data.balance_type !== "transfer") {
                await psModifyBalance.pub({
                    game_type: "luckyhongbao",
                    account_name: data.accountName,
                    change_amount: zero.sub(data.transferAmount).toNumber(),
                    pay_type: data.balance_type
                })
            }

            let count = gameResultAry.length + 1;
            let countStr = padStart(count.toString(), 2, "0");

            let realCount = gameResultAry.filter(t => t.amount > 0).length;
            realCount = realCount + 1;
            let realCountStr = padStart(realCount.toString(), 2, '0');
            let resultIdStr = `${gameInfo.game_id}${countStr}`;  //主键id的规则:  `${gameId}${maxCount+1}` .
            let result_id = parseInt(resultIdStr);

            // 已经转账或扣减余额了，后续，所有不是抢的最多的那个人，都要退款。所以要先插入red_envelope_game_result .
            let red_envelope_game_result = {
                "id": result_id,
                "game_id": gameInfo.game_id,
                "account_name": data.accountName,
                "create_time": parse(data.createTime),
                "transfer_amount": new Decimal(data.transferAmount).toNumber(), // 退款时根据 red_envelope_game_result 继续退款     
                "balance_type": data.balance_type,
                "trx_id": "",
                "amount": 0
            };
            logger.debug(`即将插入: red_envelope_game_result:${JSON.stringify(red_envelope_game_result)}`);
            await db.red_envelope_game_result.create(red_envelope_game_result, { "transaction": trans });

            let accountOpLog = {
                "id": generate(),
                "account_name": data.accountName,
                "ip_address": "",
                "op_type": `使用${data.balance_type}抢红包.预扣除.`
            };
            await db.account_log.create(accountOpLog, { "transaction": trans });

            //检查 红包剩余的数量是否还够抢.
            // 貌似这里还可以 根据 tx_id 或者 accountLog 的id ，再做一次检查

            //先调用 抢红包的合约
            let chain_action = await chainOperate.grabRedEnvelope({ 
                "accountName": data.accountName, 
                "gameId": gameInfo.game_id, 
                "result_id": result_id 
            });

            //不再从链上取用户抢了多少金额, 而从 redis 里获取
            let game_amount_key = `game_result_amount:${gameInfo.game_id}`;
            let amountStr = await redis.hget(game_amount_key, realCountStr);
            logger.debug(`game_amount_key:${game_amount_key} ,realCountStr:${realCountStr} ,  amountStr:${amountStr} `);
            //此刻应该拿到了数量. 如果没拿到, 那么就有出错了. 
            if (amountStr == null) {
                throw new Error(`从 redis 的 ${game_amount_key} 中未获取到 随机 的数量`);
            }

            await db.red_envelope_game_result.update({
                "amount": Number(amountStr),
                "trx_id": chain_action.transaction_id
            }, {
                "where": { "id": result_id },
                "transaction": trans
            });

            //调用了抢红包的合约, 那么游戏的 left_count 要扣减.  
            const left_count = Decimal.sub(gameInfo.total_count, realCount).toNumber() >> 0;
            await db.red_envelope_game.update({
                "left_count": left_count
            }, {
                "where": { "game_id": gameInfo.game_id },
                "transaction": trans
            })

            await trans.commit();

            //发布 单个用户抢红包的通知事件. 因为前端可能需要抢红包的结果。
            var grabSuccessData = {
                "game_id": gameInfo.game_id,
                "account_name": data.accountName,
                "amount": amountStr, //offer.amount,
                "room_id": gameInfo.room_id,
                "is_success": true,
                "remark": "成功"
            };
            await notify_user_grab_red_envelope.pub(grabSuccessData);
            logger.info(`发布 抢红包成功 消息 成功. %j`, grabSuccessData);

            if (left_count === 0) {
                logger.info(`game.game_id: ${gameInfo.game_id} . 此轮游戏已经结束, 发布 游戏结束事件`);
                await endGame.pub({ "game_id": gameInfo.game_id });
            } else {
                logger.info(`game.game_id:${gameInfo.game_id} . 此轮游戏未结束, left_count:${gameInfo.left_count - 1}`);
            }

            await lock.unlock();

            logger.debug(`执行抢红包操作, data: ${JSON.stringify(data)}, running time: ${Date.now() - startTime}, stopping....`);
        } catch (err) {
            await trans.rollback();
            await lock.unlock();

            logger.error(err, `解锁 key: ${lock.resource}, pg事务回滚`);
        }
    } catch (err) {
        logger.error(err, "初始化 锁 和 pg事务时报错了");
    }
}

module.exports = grabRedEnvelope;

//* @property {number} result_id      主键
/**
 * @typedef GrabRedEnvelopeArgv 抢红包事件对应的数据
 * @property {string} accountName    账户名
 * @property {number} roomId         红包游戏的id
 * @property {string} symbol         币种符号
 * @property {number} transferAmount 转账金额
 * @property {string} createTime     区块时间
 * @property {string} balance_type   余额类型 transfer 或者 balance
 */

