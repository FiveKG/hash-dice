// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "publish - subscribe start new game"});
const getAmqpChannel = require("./amqp.js");
const { START_NEW_GAME } = require("../common/constant/optConstants");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(START_NEW_GAME);
        await channel.sendToQueue(START_NEW_GAME, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(START_NEW_GAME);
        channel.consume(START_NEW_GAME, msg => {
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