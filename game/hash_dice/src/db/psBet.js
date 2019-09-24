// @ts-check
const logger = require("../common/logger.js").child({ [__filename]: "betting" });
const getAmqpChannel = require("./amqp.js");
const { HASH_DICE_BET } = require("../common/constant/optConstants");

/**
 * 
 * @param {Object} data 
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(HASH_DICE_BET);
        await channel.sendToQueue(HASH_DICE_BET, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(HASH_DICE_BET);
        channel.consume(HASH_DICE_BET, msg => {
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