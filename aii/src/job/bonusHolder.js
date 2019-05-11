const { scheduleJob } = require("node-schedule");
const { handlerHolder } = require("../businessLogic/systemPool");

// 股东分红池每周一00:00进行分配
scheduleJob("0 * * * * 1", handlerHolder);