// @ts-check
const { scheduleJob } = require("node-schedule");
const { handlerBingo } = require("../businessLogic/systemPool");
const logger = require("../common/logger.js");

logger.debug(`bonusBingo running...`);
// 每天 0：00 派奖
scheduleJob("0 0 0 */1 * *", handlerBingo);