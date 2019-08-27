// @ts-check
const logger = require("../common/logger.js").child({ "@": "mq publish and subscribe" });
const { 
    psUserWithdraw, psBuyAssets, psCheckIn, 
    psSellAssets, psBind, psGame, psTbg1, 
    psTshIncome, psRaise, psTrx
} = require("../db");
const handlerWithdraw = require("./handlerWithdraw.js");
const raiseAirdrop = require("./raiseAirdrop.js");
const bindAirdrop = require("./bindAirdrop");
const tbg1Airdrop = require("./tbg1Airdrop");
const tshIncomeAirdrop = require("./tshIncomeAirdrop");
const trxAction = require("./trxAction.js");

// 用户提现消息
psUserWithdraw.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        await handlerWithdraw(result.account_name, result.symbol, result.amount);
    } catch (err) {
        throw err;
    }
});

// 卖出资产消息
psSellAssets.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psSellAssets result: %O", result);
    } catch (err) {
        throw err;
    }
});

// 绑定消息
psBind.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psBind result: %O", result);
        await bindAirdrop(result);
    } catch (err) {
        throw err;
    }
});


// 参与 tbg1 消息
psTbg1.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTbg1 result: %O", result);
        await tbg1Airdrop(result);
    } catch (err) {
        throw err;
    }
});


// 游戏消息
psGame.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psGame result: %O", result);
    } catch (err) {
        throw err;
    }
});


// 股东账户消息
psTshIncome.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTshIncome result: %O", result);
        // 监听到消息，就从收款账户转钱到股东账户
        await tshIncomeAirdrop(result);
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
})