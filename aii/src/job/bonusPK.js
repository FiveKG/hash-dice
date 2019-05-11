const { scheduleJob } = require("node-schedule");
const { handlerPk } = require("../businessLogic/systemPool");

// 直接推荐PK奖金池每周一00:00进行分配
scheduleJob("0 * * * * 1", handlerPk);