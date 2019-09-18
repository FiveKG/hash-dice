// @ts-check
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "mq publish and subscribe" });
const { psGlobalLottoOpen, psTrx, psBet } = require("../db");
const trxAction = require("./trxAction.js");
const openGameSession = require("./openGameSession");
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
psGlobalLottoOpen.sub(async msg => {
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