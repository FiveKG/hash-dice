// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe game"});
const getAmqpChannel = require("./amqp.js");
const { GAME } = require("../common/constant/optConstants.js");

/**
 * @param {any} data
 */
async function publish(data) {
    try {
        let channel = await getAmqpChannel(GAME);
        await channel.sendToQueue(GAME, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

/**
 * @param {(arg0: string) => void} callback
 */
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(GAME);
        channel.consume(GAME, msg => {
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