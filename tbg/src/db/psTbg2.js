// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe user join tbg1"});
const getAmqpChannel = require("./amqp.js");
const { TBG_2 } = require("../common/constant/optConstants.js");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(TBG_2);
        await channel.sendToQueue(TBG_2, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(TBG_2);
        channel.consume(TBG_2, msg => {
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