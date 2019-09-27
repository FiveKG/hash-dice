// @ts-check
const logger = require("../common/logger.js").child({ "@": "mq publish and subscribe" });
const { psTrx ,psBet,psHashDiceOpen} = require("../db");
const handlerTransfer = require("./handlerTransfer");
const handlerBet = require("./handlerBet.js");
const openGameSession  = require("./openGameSession")


// 订阅转账的消息，避免双花
psTrx.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTrx result: %O", result);
        await handlerTransfer(result);
    } catch (err) {
        throw err;
    }
})

// 游戏开奖
psHashDiceOpen.sub(async msg => {
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