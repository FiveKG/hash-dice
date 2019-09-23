//@ts-check

// require("./src/initEnv.js")();
const {format } = require("date-fns");
const { grabRedEnvelope , endGame, user_recharge,notify_game_end} = require("@fjhb/mq-pub-sub");
const logger = require("@fjhb/logger").child({"@":"mqListenJob"});
const userRechargeBiz = require("./src/businessLogic/user_recharge.js");
const isNativeError = require("util").types.isNativeError;
const amqplib = require("amqplib");
process.env.LUCKY_MONEY_RABBIT_HOST = "172.17.0.3"
process.env.LUCKY_MONEY_RABBIT_PORT = "5672"
process.env.LUCKY_MONEY_RABBIT_USER = "mq_user"
process.env.LUCKY_MONEY_RABBIT_PASS = "pass_2018"
const amqpOption = {
    protocol : "amqp",
    hostname : process.env.LUCKY_MONEY_RABBIT_HOST,
    port     : Number(process.env.LUCKY_MONEY_RABBIT_PORT),
    username : process.env.LUCKY_MONEY_RABBIT_USER,
    password : process.env.LUCKY_MONEY_RABBIT_PASS,
    heartbeat: 300
};
// logger.debug(`amqp option:%j`, amqpOption);
let amqpConn = null;
let channel = null


/**
 * 获取 channel . 确保 队列名 存在.
 *
 * @param {string} queueName
 * @returns {Promise<amqplib.Channel>}
 */
async function getAmqpChannel(queueName) {
    if(queueName == null){
        throw new Error(`queueName can't be null.`)
    }
    if(amqpConn == null){
        amqpConn = await amqplib.connect(amqpOption);
        process.once("SIGINT", function () {
            amqpConn.close();  //当前进程退出时，关闭 rabbitmq 的连接
            process.exit();
        });
        
    }
    if(channel == null){
        channel = await amqpConn.createChannel();
        channel.on("ready" , () => {
            console.debug(`amqpConn is ready.`);
        })
        channel.on("error" , (err) => {
            console.debug(`amqpConn error.`, err);
        })
    }
    await channel.assertQueue( queueName  , { "durable" : true });
    return channel;
}

function delay(ms) {
    var promise = new Promise( (resolve , reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
    return promise; 
}

const accountNames = [
    "frank" , "fengruying" , "fengjunxian" , "longchaomei" , "huangwenji" , "test11"
];

/**
 * 获取当前时间的字符串
 * @returns {string}
 */
function getCurrentTimeString(){
    return format(new Date() , "YYYY-MM-DD HH:mm:sss");
}

/**
 * 订阅 用户充值事件
 */
// user_recharge.sub( async (data) => {
//     console.debug(`user_recharge event fired. ${getCurrentTimeString()}.%j`, data);
//     try {
//         // await userRechargeBiz(data);
//         console.log("data: ", data);
//     } catch (error) {
//         if(isNativeError(error)){
//             console.error(`userRechargeBiz error.`, error.message , error.stack);
//         }
//         else{
//             console.error(`userRechargeBiz error.`, JSON.stringify(error));
//         }
//     }
// });

( async () => {
    const data = {
        "a": "a",
        "b": "b"
    }
    console.debug("publish mq: ", data);
    const channel = await getAmqpChannel("test");
    channel.sendToQueue("test", Buffer.from(JSON.stringify(data)));
    channel.consume("test", (data) => {
        try {
            var msg = JSON.parse(data.content.toString());
            console.debug("msg: ", msg);
            channel.ack(data);
        } catch (error) {
            logger.error(`consume 出错.`, error.message , error.stack);
        }
    })

    // for(var i = 0 ; i< accountNames.length ; i++ ){
	// 	// grabRedEnvelope.pub({
	// 	// 	"accountName"   : accountNames[i] ,
	// 	// 	"balance_type"  : "balance" ,
	// 	// 	"createTime"    : format(new Date()),
	// 	// 	"gameId"        : 35,
	// 	// 	"symbol"        : "EOS",
	// 	// 	"transferAmount": 0.1
    //     // });
    //     console.log(`${accountNames[i] } grab`);
    //     //await delay(1000);
	// }

    //endGame.pub({"game_id": 25});

} )()