// @ts-check
const amqplib = require("amqplib");
const logger = require("../common/logger.js").child({"@":"amqplib"});
const { rabbitmq } = require("../../config.js");

const amqpOption = {
    protocol : "amqp",
    hostname : process.env.TBG_RABBIT_HOST || rabbitmq.host,
    port     : Number(process.env.TBG_RABBIT_PORT) || rabbitmq.port,
    username : process.env.TBG_RABBIT_USER || rabbitmq.user,
    password : process.env.TBG_RABBIT_PASS || rabbitmq.pwd,
    heartbeat: 300
};

logger.debug(`amqp option: %j`, amqpOption);

/**
 * @type { any }
 */
let amqpConn = null;
/**
 * @type { any }
 */
let channel = null;

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