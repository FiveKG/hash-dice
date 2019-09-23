//@ts-check
require("./initEnv.js")();
const { notify_game_end , notify_game_start , notify_user_grab_red_envelope  } = require("@fjhb/mq-pub-sub");

const dbop = require("@fjhb/db-op");

/**
 * 
 * @param {*} ms 
 */
function delay(ms) {
    var promise = new Promise( (resolve , reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
    return promise; 
}

/**
 * @typedef GameEndMessage
 * @property {string} room_id       房间id
 * @property {number} game_id       游戏id
 * @property {number} total_count   
 * @property {number} left_count
 * @property {Date} startTime       开始时间
 * @property {Date} endTime         结束时间
 * @property {GameResult[]} results  哪个用户， 抢了多少数量
 * @property {string} nextSender    下一轮游戏由谁发出
 * @property {string} gameChainBlockId   红包游戏的 链id
 * 
 */

/**
 * @typedef GameResult
 * @property {string} account_name  用户名
 * @property {number} amount        抢到的金额
 */
async function  pubGameEnd(gameEndMsg){
    notify_game_end.pub(gameEndMsg);
}

/**
 * @typedef GameStartMessage
 * @property {string} room_id       房间id
 * @property {number} game_id       游戏id
 * @property {string} account_name  
 * @property {Date}   create_time
 * @property {string} amount        红包的总额
 * @property {number} quantity      红包的数量
 */
async function  pubGameStart(gameStartMsg){
    notify_game_start.pub(gameStartMsg);
}

/**
 * 通知 用户抢红包事件 的消息
 * @typedef NotifyUserGrabRedEnvelopeMessage
 * @property {number} game_id       游戏id(红包id)
 * @property {string} account_name  用户
 * @property {string} amount        抢到的数量 类似: 1.7694 EOS
 * @property {boolean} is_success    是否抢成功
 * @property {string} remark         描述
 * @property {Number} room_id       房间id
 */
async function  pubGrabMsg(grabMsg){
    notify_user_grab_red_envelope.pub(grabMsg);
}

( async () =>{
    //先发 抢红包成功的消息
    // account_name:fengruying11   , game_id = 1
    let gameEndMsg = {
        "game_id": 1,
        "room_id": "1",
        "total_count": 5,
        "left_count": 5,
        "startTime": new Date(),
        "endTime": new Date(),
        "results": [{
            "account_name": "yujinsheng11",
            "amount": 0.1
        }],
        "nextSender": "yujinsheng11",
        "gameChainBlockId": ""
    }

    let gameStartMsg = {
        "room_id": "1",
        "game_id": 1,
        "account_name": "yujinsheng11",
        "create_time": new Date(),
        "amount": "1.0000 UE",
        "quantity": 5
    }

    let grabMsg = {
        "game_id": 1,
        "account_name": "fengruying22",
        "amount": "0.1000 UE",
        "is_success": true,
        "remark": "抢到红包",
        "room_id": "1"
    }
    
    // await pubGameEnd(gameEndMsg);
    // await pubGameStart(gameStartMsg);
    await pubGrabMsg(grabMsg);
    process.exit();
} )()