// @ts-check
const { scheduleJob } = require("node-schedule");
const { handlerHolder } = require("../businessLogic/systemPool");
const logger = require("../common/logger.js");

logger.debug(`bonusHolder running...`);

// 股东分红池每周一00:00进行分配
scheduleJob("0 0 0 * * 1", handlerHolder);