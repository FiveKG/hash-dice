const { scheduleJob } = require("node-schedule");
const { handlerSafe } = require("../businessLogic/systemPool");

// 五倍收益保障池每日00:00进行分配
scheduleJob("0 0 0 */1 * *", handlerSafe);