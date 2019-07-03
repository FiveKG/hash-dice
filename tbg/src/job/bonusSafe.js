// @ts-check
const { scheduleJob } = require("node-schedule");
const { handlerSafe } = require("../businessLogic/systemPool");
const logger = require("../common/logger.js");

logger.debug(`bonusSafe running...`);
// 五倍收益保障池每日00:00进行分配
scheduleJob("0 0 0 */1 * *", handlerSafe);