// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe user join tbg1"});
const getAmqpChannel = require("./amqp.js");
const { TBG_1 } = require("../common/constant/optConstants.js");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(TBG_1);
        await channel.sendToQueue(TBG_1, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(TBG_1);
        channel.consume(TBG_1, msg => {
            // logger.debug("user join tbg1 message: ", msg);
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