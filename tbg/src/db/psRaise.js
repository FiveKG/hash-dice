// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe user raise"});
const getAmqpChannel = require("./amqp.js");
const { RAISE } = require("../common/constant/optConstants.js");

/**
 * @param {any} data
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(RAISE);
        await channel.sendToQueue(RAISE, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

/**
 * @param {(arg0: string) => void} callback
 */
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(RAISE);
        channel.consume(RAISE, msg => {
            // logger.debug("user raise message: ", msg);
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