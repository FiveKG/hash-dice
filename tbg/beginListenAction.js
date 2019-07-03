// @ts-check
const handlerTransferActions = require("./src/job/listenTransfer.js");
const { scheduleJob } = require("node-schedule");
const logger = require("./src/common/logger.js");

logger.debug(`beginListenAction running...`);
scheduleJob("*/1 * * * * *", handlerTransferActions);

// ;(async ()=> {
//     try {
//         // await handlerTransferActions();
//         await beginListenAction(1000);
//         process.exit(0);
//     } catch (err) {
//         throw err;
//     }
// })();

async function beginListenAction(ms) {
    try {
        await handlerTransferActions();
        await sleep(ms);
        await beginListenAction(ms);
    } catch (err) {
        throw err;
    }
}

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}