// @ts-check
const logger = require("../common/logger.js").child({ "@": "mq publish and subscribe" });
const { psTrx ,psBet,hashDiceOpen} = require("../db");
const trxAction = require("./trxAction.js");
const handlerBet = require("./handlerBet.js");
const openGameSession  = require("./openGameSession.js")


// 订阅转账的消息，避免双花
psTrx.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTrx result: %O", result);
        await trxAction(result);
    } catch (err) {
        throw err;
    }
})

// 游戏开奖
hashDiceOpen.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTrx result: %O", result);
        await openGameSession(result);
    } catch (err) {
        throw err;
    }
});


// 游戏投注
psBet.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psBet result: %O", result);
        await handlerBet(result);
    } catch (err) {
        throw err;
    }
});