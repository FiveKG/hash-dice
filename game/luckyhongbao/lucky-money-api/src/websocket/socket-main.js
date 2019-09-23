//@ts-check
var logger = require("@fjhb/logger").child({ "@": "socket-main" });
const io = require("socket.io");
const redis = require("@fjhb/lm-redis");
const { notify_game_end, notify_game_start, notify_user_grab_red_envelope, notifyUserWithdraw } = require("@fjhb/mq-pub-sub");
const { red_envelope_game, red_envelope_game_result } = require("@fjhb/db-op");
const { utils } = require('../common')
const { isBefore, isAfter } = require("date-fns");

let socketMap = {};
let WsServer = null;

/**
 * @brief 初始化 socke 服务
 * @param { Object } server 
 */
function init(server) {
    // 心跳
    // , { "pingTimeout": 5000, "pingInterval": 25000 }
    WsServer = io(server);
    logger.info(`websocket init.`);
    WsServer.on("connection", socket => {
        // 监听加入消息,放到不同的房间中
        socket.on("join", async msg => {
            logger.info(`user join information: ${JSON.stringify(msg)}`);
            if (msg.room_id && msg.account_name && msg.club_id) {
                join_online_count(msg, socket, WsServer);
            } else {
                socket.disconnect();
            }
        });

        socket.on("ping-test", async msg => {
            logger.debug(`club: ${msg.club_id}, room: ${msg.room_id}, account: ${msg.account_name}, socketId: ${socket.id}, connecting....`);
            await redis.set(`lm:online_count:club_${msg.club_id}:${msg.room_id}:${msg.account_name}`, `${socket.id}`, "EX", 30);
        });

        // 监听到 leave 后直接断开该连接
        // socket.on('leave', function (data) {
        //     logger.debug("socket leave: ", data);
        //     socket.emit('disconnect', data);
        // });

        socket.on("disconnect", async msg => {
            logger.debug(`user disconnect information: ${JSON.stringify(msg)} socket.id: ${socket.id} , socket.rooms:${socket.rooms}`);
            exit_online_count(msg, socket.id, WsServer);
        });


        sendWithdrawResult(socket);
    })
        .on("disconnect", function (reason) {
            logger.debug("socket disconnect: ", reason);
        })
        .on("error", function (error) {
            logger.error("socket connect error, error info: ", error);
        });
}

/**
 * 订阅游戏结束事件,转发给前端 socket
 */
notify_game_end.sub(async (data) => {
    try {
        if (WsServer) {
            logger.debug("notify_game_end : ", data);

            data.results.sort(compareByCreateTime);

            WsServer.to(data.room_id).emit("get_envelope_result", data);
        }
    } catch (error) {
        throw error;
    }
});


/**
 * 订阅发出新红包事件,转发给前端 socket
 */
notify_game_start.sub(async data => {
    logger.debug("notify_game_start : ", data);
    try {
        if (WsServer) {
            WsServer.to(data.room_id).emit("new_red_envelope", data);
            logger.debug(`WsServer.to(${data.room_id}).emit("new_red_envelope", data);`);
        }
        else {
            logger.error("WsServer== null : ", data);
        }
    } catch (error) {
        logger.error(`notify_game_start error. `, error);
        throw error;
    }
});

/**
 * 订阅用户抢红包事件,转发给前端 socket
 */
notify_user_grab_red_envelope.sub(async data => {
    logger.debug("notify_user_grab_red_envelope sub: ", data);
    try {
        logger.debug(`WsServer == null ? ${WsServer == null}`);
        if (WsServer) {
            let find_game = await red_envelope_game.get_by_gameid(data.game_id);
            // let account_socket_id = await redis.get(`lm:online_count:${ data.room_id }:${ data.account_name }`);
            logger.debug("notify_user_grab_red_envelope: ", find_game);
            // if (find_game && !!account_socket_id) {
            // 单独发送消息
            // WsServer.sockets.connected[account_socket_id].emit("grab_red_envelope", { id: account_socket_id, param: data }, data => {
            //     logger.debug("单独发送抢到红包的结果:",data);
            // });
            const GrabbedList = await red_envelope_game_result.getGrabbedByGameId(data.game_id);
            data['grabbed_list'] = GrabbedList;

            WsServer.to(find_game.room_id).emit("grab_red_envelope", data);
            logger.debug(`WsServer.to(${find_game.room_id}).emit("grab_red_envelope", data);`);
            // }
        }
    } catch (error) {
        logger.error(`notify_user_grab_red_envelope sub , error.`, error);
        throw error;
    }
});

module.exports = init;

/**
 * @brief 用户加入时更新实时在线人数
 * @param { Object } msg 
 * @param { Object } socket 
 * @param { Object } WsServer 
 */
async function join_online_count(msg, socket, WsServer) {
    let room_online_account_key = `lm:online_count:club_${msg.club_id}:${msg.room_id}:*`;

    let account_list = await redis.keys(room_online_account_key);
    // 获取该用户加入时的 socket.id
    logger.debug(`room_online_account_key:${room_online_account_key}`);
    logger.debug(`all account -------> account_list: %j`, account_list);

    let account_socket_id = await redis.get(`lm:online_count:club_${msg.club_id}:${msg.room_id}:${msg.account_name}`);
    if (!socketMap[socket.id]) {
        socketMap[socket.id] = {};
    }

    let count = account_list.length;  // 该房间总人数
    // let idx = account_list.indexOf(`lm:online_count:${msg.club_id}:${msg.room_id}:$ { msg.account_name }`);
    // 用户对应的 socket.id 不存在, online_count 加 1;
    if (!count) {  // 当前房间人数为 0
        count = 1;
    } else {
        if (!account_socket_id) {  // 该房间不存在该用户
            count++;
        }
    }

    logger.debug("account_list count: ", count);

    let join_data = {
        "club_id": msg.club_id,
        "room_id": msg.room_id,
        "account_name": msg.account_name
    };

    socket.join(msg.room_id, () => {
        logger.debug("socket join info: ", socket.rooms);
    });

    logger.debug("set socketMap");
    // 存储 socket.id 
    // client 断开时使用
    socketMap[socket.id] = join_data;
    logger.info("detail of the socketMap after setting: ", JSON.stringify(socketMap));

    try {
        // 每次进来都重新设置 redis 里面的 socket.id
        await redis.set(`lm:online_count:club_${msg.club_id}:${msg.room_id}:${msg.account_name}`, `${socket.id}`, "EX", 30); // todo
        // await redis.set(`lm:room_${ msg.room_id }`, `${ count }`);
        // if (Number(msg.club_id) === 1) {
        //     WsServer.to(msg.room_id).emit("join_result", count + utils.randInt(20, 30));
        // } else {
        WsServer.to(msg.room_id).emit("join_result", count);
        // }

    } catch (error) {
        logger.error("join_online_count error: ", error);
        throw error;
    }
}

/**
 * @brief 用户断开时更新实时在线人数
 * @param { Object } msg
 * @param { string } socket_id 
 * @param { Object } WsServer 
 */
async function exit_online_count(msg, socket_id, WsServer) {
    try {
        let join_data = socketMap[socket_id];
        if (!join_data) {
            return;
        }

        let account_list = await redis.keys(`lm:online_count:club_${join_data.club_id}:${join_data.room_id}:*`);
        let account_socket_id = await redis.get(`lm:online_count:club_${join_data.club_id}:${join_data.room_id}:${join_data.account_name}`);
        let count = account_list.length;

        logger.debug("account_list count: ", count);

        if (account_socket_id) {
            await redis.del(`lm:online_count:club_${join_data.club_id}:${join_data.room_id}:${join_data.account_name}`);
        }

        if (!count) {
            count = 0;
        } else {
            count--;
        }

        // await redis.set(`lm:room_${ join_data.room_id }`, `${ count }`);
        // if (Number(join_data.club_id) === 1) {
        //     WsServer.to(join_data.room_id).emit("join_result", count + utils.randInt(20, 30));
        // } else {
        WsServer.to(join_data.room_id).emit("join_result", count);
        // }

        logger.debug("delete socketMap element");
        delete socketMap[socket_id];
        logger.debug("detail of the socketMap after delete: ", JSON.stringify(socketMap));
    } catch (error) {
        logger.error("exit_online_count error: ", error);
        throw error;
    }
}

/**
 * 发送提现消息
 * @param {io.Socket} socket 
 */
async function sendWithdrawResult(socket) {
    try {
        let publish = false;

        await notifyUserWithdraw.sub((data) => {
            if (!publish) {
                publish = true;
                logger.debug(`用户提现结果, data: %j`, data);
                socket.emit("user_withdraw", data)
            }
        });
    } catch (err) {
        logger.error(err, "发送提现结果时, 报错了")
    }
}

/**
 * 比较 两个 gameResult
 * @param {object} a_gameResult
 * @param {object} b_gameResult
 * @returns
 */
function compareByAmount(a_gameResult, b_gameResult) {
    if (Number(a_gameResult.amount) < Number(b_gameResult.amount)) {           // 按某种排序标准进行比较, a 小于 b
        return -1;
    }
    if (Number(a_gameResult.amount) > Number(b_gameResult.amount)) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

/**
 * 比较 两个 gameResult
 *
 * @param {object} a_gameResult
 * @param {object} b_gameResult
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
