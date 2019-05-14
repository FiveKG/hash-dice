// @ts-check
const { scheduleJob } = require("node-schedule");
const { handlerPk } = require("../businessLogic/systemPool");
const logger = require("../common/logger.js");

logger.debug(`bonusPK running...`);
// 直接推荐PK奖金池每周一00:00进行分配
scheduleJob("0 0 0 * * 1", handlerPk);