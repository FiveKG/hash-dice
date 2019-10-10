// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe transaction"});
const getAmqpChannel = require("./amqp.js");

const SNAPSHOT = 'snapshot'
/**
 * @param {any} data
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(SNAPSHOT);
        await channel.sendToQueue(SNAPSHOT, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}


/**
 * @param {(arg0: string) => void} callback
 */
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(SNAPSHOT);
        channel.consume(SNAPSHOT, msg => {
            // logger.debug("subscribe userWithdraw message: ", msg);
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