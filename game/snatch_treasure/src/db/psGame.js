// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe game"});
const getAmqpChannel = require("./amqp.js");
const { SNATCH_MQ } = require("../common/constant/optConstants");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(SNATCH_MQ);
        await channel.sendToQueue(SNATCH_MQ, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(SNATCH_MQ);
        channel.consume(SNATCH_MQ, msg => {
            // logger.debug("game message: ", msg);
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