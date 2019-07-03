// @ts-check
const logger = require("../common/logger.js").child({"@": "publish - subscribe user withdraw"});
const getAmqpChannel = require("./amqp.js");

const USER_WITHDRAW = "userWithdraw"

async function publish(data) {
    try {
        let channel = await getAmqpChannel(USER_WITHDRAW);
        await channel.sendToQueue(USER_WITHDRAW, Buffer.from(JSON.stringify(data)));
    } catch (err) {
        throw err;
    }
}

async function subscribe(callback) {
    try {
        let channel = await getAmqpChannel(USER_WITHDRAW);
        channel.consume(USER_WITHDRAW, msg => {
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

const userWithdraw = {
    "pub": publish,
    "sub": subscribe
  }
  
  module.exports = userWithdraw;
  
  /**
   * @typedef UserRechargeMessage
   * @property {string} account_name 账号
   * @property {number} amount 提现数量
   * @property {string} symbol 代币符号
   */