// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe buy assets"});
const getAmqpChannel = require("./amqp.js");
const { BUY } = require("../common/constant/optConstants.js");

/**
 * @param {any} data
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(BUY);
        await channel.sendToQueue(BUY, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

/**
 * @param {(arg0: string) => void} callback
 */
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(BUY);
        channel.consume(BUY, msg => {
            // logger.debug("buy assets message: ", msg);
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