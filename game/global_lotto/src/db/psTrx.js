// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe transaction"});
const getAmqpChannel = require("./amqp.js");

const TRX = 'global_lotto_transaction'
async function publish(data) {
    try {
        let channel = await getAmqpChannel(TRX);
        await channel.sendToQueue(TRX, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(TRX);
        channel.consume(TRX, msg => {
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