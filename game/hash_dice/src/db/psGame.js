// @ts-check
const logger = require("../common/logger.js").child({ [__filename]: "subscribe game" });
const getAmqpChannel = require("./amqp.js");
const { HASH_DICE_MQ } = require("../common/constant/optConstants.js");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(HASH_DICE_MQ);
        await channel.sendToQueue(HASH_DICE_MQ, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(HASH_DICE_MQ);
        channel.consume(HASH_DICE_MQ, msg => {
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