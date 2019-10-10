// @ts-check
const logger = require("../common/logger.js").child({"@": "修改账户余额"});
const getAmqpChannel = require("./amqp.js");

const opts = 'psModifyBalance';
/**
 * @param {any} data
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(opts);
        await channel.sendToQueue(opts, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

/**
 * @param {(arg0: string) => void} callback
 */
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(opts);
        channel.consume(opts, msg => {
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