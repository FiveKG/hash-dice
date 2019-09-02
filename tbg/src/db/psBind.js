// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe bind referrer"});
const getAmqpChannel = require("./amqp.js");
const { BIND } = require("../common/constant/optConstants.js");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(BIND);
        await channel.sendToQueue(BIND, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(BIND);
        channel.consume(BIND, msg => {
            // logger.debug("bind referrer message: ", msg);
            if (msg !== null) {
                callback(msg.content.toString());
                channel.ack(msg);
            }
        });
    } catch (err) {
        throw err;
    }
}
  
module.exports = {
    "pub": publish,
    "sub": subscribe
};