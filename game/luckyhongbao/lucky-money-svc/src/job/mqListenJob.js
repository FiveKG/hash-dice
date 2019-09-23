//@ts-check

//消息队列监听服务
// 监听 startNewGame  以及 endGame  事件。分别调用 对应的业务逻辑处理
// require("../initEnv.js")();
const {
    startNewGame,
    endGame, 
    grabRedEnvelope, 
    user_recharge,
    userWithdraw
} = require("@fjhb/mq-pub-sub");
const logger = require("@fjhb/logger").child({[`@${ __filename }`]:"mqListenJob"});
const { format } = require("date-fns");
const startNewGameBiz = require("../businessLogic/startNewGame.js");
const endGameBiz = require("../businessLogic/endGame.js");
const grabRedEnvelopeBiz = require("../businessLogic/grabRedEnvelope.js")
const userRechargeBiz = require("../businessLogic/user_recharge.js");
const isNativeError = require("util").types.isNativeError;

logger.info(`message queen Listen Job started. ${getCurrentTimeString()}`);

// /**
//  * 订阅 用户充值事件
//  */
// user_recharge.sub( async (data) => {
//     logger.debug(`user_recharge event fired. ${getCurrentTimeString()}.%j`, data);
//     try {
//         await userRechargeBiz(data);
//     } catch (error) {
//         if(isNativeError(error)){
//             logger.error(`userRechargeBiz error.`, error.message , error.stack);
//         }
//         else{
//             logger.error(`userRechargeBiz error.`, JSON.stringify(error));
//         }
//     }
// });

/**
 * 订阅 开始新游戏的事件
 */
startNewGame.sub( async (data) => {
    logger.debug(`startNewGame event fired.${getCurrentTimeString()}. %j`,data);
    // 使用 data 里的 信息 ， 调用 创建红包的操作。
    try {
        await startNewGameBiz(data);
    } catch (error) {
        if(isNativeError(error)){
            logger.error(`startNewGameBiz error.`, error.message , error.stack);
        }
        else{
            logger.error(`startNewGameBiz error.`, JSON.stringify(error));
        }
    }
});

/**
 * 订阅 游戏结束的事件
 */
endGame.sub(  async (data) => {
    //发起 非最多 用户的退款， 然后 发布 开始新游戏的事件
    logger.debug(`endGame event fired.${getCurrentTimeString()}. %j`,data);
    try {
        await endGameBiz(data.game_id);
    } catch (error) {
        // logger.error(`endGameBiz.`, error);
        if(isNativeError(error)){
            logger.error(`endGameBiz error.`, error.message , error.stack);
        }
        else{
            logger.error(`endGameBiz error.`, JSON.stringify(error));
        }
    }
});

/**
 * 订阅用户抢红包的事件
 */
grabRedEnvelope.sub( async (data) => {
    //调用链上的  抢红包的合约
    logger.debug(`grabRedEnvelope. %j`,data);
    try {
        grabRedEnvelopeBiz(data);
    } catch (error) {
        // logger.error(`grabRedEnvelopeBiz.`, error);
        if(isNativeError(error)){
            logger.error(`grabRedEnvelopeBiz error.`, error.message , error.stack);
        }
        else{
            logger.error(`grabRedEnvelopeBiz error.`, JSON.stringify(error));
        }
    }
});


/**
 * 获取当前时间的字符串
 * @returns {string}
 */
function getCurrentTimeString(){
    return format(new Date() , "YYYY-MM-DD HH:mm:sss");
}
