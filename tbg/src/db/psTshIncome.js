// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe user withdraw"});
const getAmqpChannel = require("./amqp.js");
const { TSH_INCOME } = require("../common/constant/accountConstant.js");

async function publish(data) {
    try {
        let channel = await getAmqpChannel(TSH_INCOME);
        await channel.sendToQueue(TSH_INCOME, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(TSH_INCOME);
        channel.consume(TSH_INCOME, msg => {
            logger.debug("subscribe userWithdraw message: ", msg);
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