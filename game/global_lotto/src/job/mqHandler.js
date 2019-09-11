// @ts-check
const logger = require("../common/logger.js").child({ "@": "mq publish and subscribe" });
const { psGlobalLottoOpen, psGame, psTrx } = require("../db");
const trxAction = require("./trxAction.js");
const openGameSession = require("./openGameSession");


// 游戏消息
psGame.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psGame result: %O", result);
    } catch (err) {
        throw err;
    }
});

// 订阅转账的消息，避免双花
psTrx.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTrx result: %O", result);
        await trxAction(result);
    } catch (err) {
        throw err;
    }
});

// 游戏开奖
psGlobalLottoOpen.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTrx result: %O", result);
        await openGameSession(result);
    } catch (err) {
        throw err;
    }
});