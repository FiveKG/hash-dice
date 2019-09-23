//@ts-check
const schedule = require("node-schedule");
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: 'doListenChainTransferActionJob' });
const listenChainTransferAction = require("../businessLogic/listenChainTransferAction.js");

logger.debug(`doListenChainTransferActionJob starting...`);

schedule.scheduleJob("*/1 * * * * *", listenChainTransferAction);

// function doListenChainTransferActionJob() {
//     setTimeout(async () => {
//         try {
//             await listenChainTransferAction();
//         } catch (err) {
//             logger.error(err, 'doListenChainTransferActionJob failed');
//         }
//         doListenChainTransferActionJob()
//     }, 1000)
// }

// doListenChainTransferActionJob();