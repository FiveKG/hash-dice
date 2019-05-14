const { scheduleJob } = require("node-schedule");
const { handlerBingo } = require("../businessLogic/systemPool");

// 每天 0：00 派奖
scheduleJob("0 0 0 */1 * *", handlerBingo);