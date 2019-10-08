// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe user check in"});
const getAmqpChannel = require("./amqp.js");
const { CHECK_IN } = require("../common/constant/optConstants.js");

/**
 * @param {any} data
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(CHECK_IN);
        await channel.sendToQueue(CHECK_IN, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

/**
 * @param {(arg0: string) => void} callback
 */
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(CHECK_IN);
        channel.consume(CHECK_IN, msg => {
            // logger.debug("user check in message: ", msg);
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