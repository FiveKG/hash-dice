//@ts-check

const schedule = require("node-schedule");
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: 'doAutoGrab' });
const autoGrab = require("../businessLogic/autoGrab.js");

(async ()=>{
    logger.debug(`doAutoGrab starting...`);
    //启动前 先初始化 一下 账户.
    await autoGrab.initAutoGrabAccounts();
    
    //自动抢红包的任务  
    schedule.scheduleJob("*/10  * * * * *", autoGrab.autoGrab);
})()

