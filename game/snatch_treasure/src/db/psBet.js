// @ts-check
const logger = require("../common/logger.js").child({"@": "游戏投注"});
const getAmqpChannel = require("./amqp.js");
const { SNATCH_BET } = require("../common/constant/optConstants");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(SNATCH_BET);
        await channel.sendToQueue(SNATCH_BET, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(SNATCH_BET);
        channel.consume(SNATCH_BET, msg => {
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