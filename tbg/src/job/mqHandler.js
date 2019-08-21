// @ts-check
const logger = require("../common/logger.js").child({ "@": "mq publish and subscribe" });
const { psUserWithdraw, psBuyAssets, psCheckIn, psSellAssets, psBind, psGame, psTbg1 } = require("../db");
const handlerWithdraw = require("./handlerWithdraw.js");
const { insertBalanceLog } = require("../models/balance");
const { updateTbgBalance } = require("../models/tbgBalance");
const { pool } = require("../db");

// 用户提现消息
psUserWithdraw.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        await handlerWithdraw(result.account_name, result.symbol, result.amount);
    } catch (err) {
        throw err;
    }
});

// 买入资产包消息
psBuyAssets.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        logger.debug("result: %O", result);
    } catch (err) {
        throw err;
    }
});

// 签到消息
psCheckIn.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        logger.debug("result: %O", result);
    } catch (err) {
        throw err;
    }
});

// 卖出资产消息
psSellAssets.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        logger.debug("result: %O", result);
    } catch (err) {
        throw err;
    }
});

// 绑定消息
psBind.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        logger.debug("result: %O", result);
        const trxList = [];
        trxList.push(result.account);
        if (!!result.referrer) {
            trxList.push(result.referrer);
        }
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                // @ts-ignore
                updateTbgBalance(client, ...it.insertBalanceLog),
                // @ts-ignore
                insertBalanceLog(client, ...it.updateTbgBalance)
            }))
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        throw err;
    }
});


// 参与 tbg1 消息
psTbg1.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        logger.debug("result: %O", result);
        const trxList = [];
        trxList.push(result.account);
        if (!!result.referrer) {
            trxList.push(result.referrer);
        }
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                // @ts-ignore
                updateTbgBalance(client, ...it.insertBalanceLog),
                // @ts-ignore
                insertBalanceLog(client, ...it.updateTbgBalance)
            }))
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        throw err;
    }
});


// 游戏消息
psGame.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        logger.debug("result: %O", result);
    } catch (err) {
        throw err;
    }
});