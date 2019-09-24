//@ts-check
const schedule = require("node-schedule");
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: 'doListenChainTransferActionJob' });
const listenChainTransferAction = require("../businessLogic/listenChainTransferAction.js");

logger.debug(`doListenChainTransferActionJob starting...`);

schedule.scheduleJob("*/1 * * * * *", listenChainTransferAction);