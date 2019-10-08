// @ts-check
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "mq publish and subscribe" });
const { 
    psUserWithdraw, psBuyAssets, psSellAssets, psBind, psGame, psTbg2, 
    psTshIncome, psTrx, psModifyBalance, psSnapshot
} = require("../db");
const handlerWithdraw = require("./handlerWithdraw.js");
const handlerSellAssets = require("./handlerSellAssets.js");
const handlerBuyAssets = require("./handlerBuyAssets.js");
const bindAirdrop = require("./bindAirdrop");
const tbg1Airdrop = require("./tbg1Airdrop");
const tshIncomeAirdrop = require("./tshIncomeAirdrop");
const trxAction = require("./trxAction.js");
const modifyBalance = require("./modifyBalance");
const genSnapshot = require("./genSnapshot");

// 用户提现消息
psUserWithdraw.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        await handlerWithdraw(result.account_name, result.symbol, result.amount);
    } catch (err) {
        logger.error("psUserWithdraw error: ", err);
        throw err;
    }
});

// 处理卖出资产消息
psBuyAssets.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psSellAssets result: %O", result);
        await handlerBuyAssets(result);
    } catch (err) {
        logger.error("psBuyAssets error: ", err);
        throw err;
    }
});

// 处理卖出资产消息
psSellAssets.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psSellAssets result: %O", result);
        await handlerSellAssets(result);
    } catch (err) {
        logger.error("psSellAssets error: ", err);
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
        logger.error("psBind error: ", err);
        throw err;
    }
});


// 参与 tbg2 消息
psTbg2.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psTbg2 result: %O", result);
        await tbg1Airdrop(result);
    } catch (err) {
        logger.error("psTbg2 error: ", err);
        throw err;
    }
});

// 游戏消息
psGame.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psGame result: %O", result);
    } catch (err) {
        logger.error("psGame error: ", err);
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
        logger.error("psTshIncome error: ", err);
        throw err;
    }
});

// 订阅转账的消息，避免双花
psTrx.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        if (result.length === 0) {
            return;
        }
        logger.debug("psTrx result: %O", result);
        await trxAction(result);
    } catch (err) {
        logger.error("psTrx error: ", err);
        throw err;
    }
});

// 修改账户余额
psModifyBalance.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psModifyBalance result: %O", result);
        await modifyBalance(result);
    } catch (err) {
        logger.error("psModifyBalance error: ", err);
        throw err;
    }
});

// 生成快照
psSnapshot.sub(async msg => {
    try {
        let result = JSON.parse(msg);
        logger.debug("psSnapshot result: %O", result);
        if (!!result.account_name && !!result.refList) {
            await genSnapshot(result.account_name, result.refList);
        }
    } catch (err) {
        logger.error("psSnapshot error: ", err);
        throw err;
    }
});