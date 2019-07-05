// @ts-check
const { handlerBingo, handlerHolder, handlerPk, handlerSafe } = require("../../businessLogic/systemPool");
const { scheduleJob } = require("node-schedule");

;(async () => {
    await handlerBingo();
    await handlerHolder();
    await handlerPk();
    await handlerSafe();
})();