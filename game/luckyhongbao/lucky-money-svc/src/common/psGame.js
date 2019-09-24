// @ts-check
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "tbg game mq" });
const getAmqpChannel = require("./amqp.js");

const TBG_GAME_MQ = 'tbg_game_mq';

async function publish(data) {
    try {
        let channel = await getAmqpChannel(TBG_GAME_MQ);
        await channel.sendToQueue(TBG_GAME_MQ, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(TBG_GAME_MQ);
        channel.consume(TBG_GAME_MQ, msg => {
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