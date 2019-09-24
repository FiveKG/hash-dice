// @ts-check
const logger = require("../common/logger.js").child({ [__filename]: "Hash dice open" });

const {HASH_DICE_OPEN} = require("../common/constant/optConstants")
const getAmqpChannel = require("./amqp.js");

/**
 * 
 * @param {Number|String} open_block_num 
 */
async function publish(open_block_num) {
    try {
        let channel = await getAmqpChannel(HASH_DICE_OPEN);
        await channel.sendToQueue(HASH_DICE_OPEN, Buffer.from(JSON.stringify(open_block_num)));
    } catch (err) {
        throw err;
    }
}

//@ts-ignore
async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(HASH_DICE_OPEN);
        channel.consume(HASH_DICE_OPEN, msg => {
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