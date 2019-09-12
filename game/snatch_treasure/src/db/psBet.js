// @ts-check
const logger = require("../common/logger.js").child({"@": "游戏投注"});
const getAmqpChannel = require("./amqp.js");
const { GLOBAL_LOTTO_BET } = require("../common/constant/optConstants");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(GLOBAL_LOTTO_BET);
        await channel.sendToQueue(GLOBAL_LOTTO_BET, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(GLOBAL_LOTTO_BET);
        channel.consume(GLOBAL_LOTTO_BET, msg => {
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