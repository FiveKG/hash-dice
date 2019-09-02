// @ts-check
const amqplib = require("amqplib");
const logger = require("../common/logger.js").child({"@":"amqplib"});
process.env.TBG_RABBIT_HOST = "172.17.0.4"
process.env.TBG_RABBIT_PORT = "5672"
process.env.TBG_RABBIT_USER = "mq_user"
process.env.TBG_RABBIT_PASS = "pass_2018"
const amqpOption = {
    protocol : "amqp",
    hostname : process.env.TBG_RABBIT_HOST,
    port     : Number(process.env.TBG_RABBIT_PORT),
    username : process.env.TBG_RABBIT_USER,
    password : process.env.TBG_RABBIT_PASS,
    heartbeat: 300
};

logger.debug(`amqp option: %j`, amqpOption);

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
            logger.debug(`amqpConn is ready.`);
        })
        channel.on("error" , (err) => {
            logger.debug(`amqpConn error.`, err);
        })
    }
    await channel.assertQueue(queueName, { "durable" : true });
    return channel;
}


module.exports = getAmqpChannel;