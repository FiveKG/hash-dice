// @ts-check
const logger = require("../common/logger.js").child({ "@": "mq publish and subscribe" });
const { psSnatchOpen, psTrx, psBet, psModifyBalance, psStartNewGame } = require("../db");
const trxAction = require("./trxAction.js");
const openGameSession = require("./openGameSession");
const startGameSession = require("./startGameSession");
const handlerBet = require("./handlerBet.js");

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
psSnatchOpen.sub(async msg => {
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
        logger.debug("psTrx result: %O", result);
        await handlerBet(result);
    } catch (err) {
        throw err;
    }
});

// 开始新游戏
psStartNewGame.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTrx result: %O", result);
        await startGameSession(result);
    } catch (err) {
        throw err;
    }
});