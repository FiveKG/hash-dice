// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe sell assets"});
const getAmqpChannel = require("./amqp.js");
const { SELL } = require("../common/constant/optConstants.js");

/**
 * @param {any} data
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(SELL);
        await channel.sendToQueue(SELL, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

/**
 * @param {(arg0: string) => void} callback
 */
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(SELL);
        channel.consume(SELL, msg => {
            // logger.debug("sell assets message: ", msg);
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