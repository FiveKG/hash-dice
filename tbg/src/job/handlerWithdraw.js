// @ts-check
const { redis } = require("../common");
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/handlerWithdraw.js": "user withdraw" });
const { userWithdraw } = require("../models/asset");
const { getUserBalance } = require("../models/balance");
const { insertAccountOp } = require("../models/accountOp");
const handlerTransfer = require("./handlerTransfer.js");
const { Decimal } = require("decimal.js");
const { format } = require("date-fns");
const { EOS_TOKEN, TBG_TOKEN, DISPENSE_ACCOUNT, PRIVATE_KEY_TEST } = require("../common/constant/eosConstants.js");

/**
 * 处理提现
 * @param {String} accountName 账号
 * @param {String} symbol 代币符号
 * @param {Number} amount 提现数量
 */
async function handlerWithdraw(accountName, symbol, amount) {
    logger.debug(`${ accountName } 请求提现 ${ amount } ${ symbol }`);
    let userWithdrawKey = `tbg:withdraw:${ accountName }`;
    let withdrawFlag = await redis.get(userWithdrawKey);
    if(withdrawFlag){
        //记录异常用户日志。
        let now = format(new Date(), "YYYY-MM-DD HH:mm:ss");
        let warnStr = `withdraw_frequency_to_fast. ${ accountName } 在 ${ withdrawFlag } 最后一次成功提现。当前时间: ${ now }`;
        logger.warn(warnStr);  
        return;
    }
    let client = await pool.connect();
    await client.query("BEGIN");
    try {
        let rows = await getUserBalance(accountName);
        if (!rows) {
            logger.debug("this account does not exists");
            return;
        }

        let userAmount = new Decimal(rows.amount);
        logger.debug("user balance is ", userAmount);
        if (userAmount.lessThan(amount)) {
            logger.debug("insufficient balance");
            return;
        }
        let changeAmount = new Decimal(-amount);
        let remark = `user ${ accountName } withdraw ${ amount } ${ symbol }`;
        await userWithdraw(client, accountName, changeAmount, 'withdraw', remark);
        await insertAccountOp(client, accountName, 'withdraw', remark);
        try {
            if (symbol === "UE" || symbol === "TBG") {
                let quantity = `${ amount.toFixed(4) } ${ symbol }`;
                let memo = `user withdraw`;
                let tokenType = ``;
                if (symbol === "UE") {
                    tokenType = EOS_TOKEN;
                } else {
                    tokenType = TBG_TOKEN;
                }
                logger.debug(tokenType, DISPENSE_ACCOUNT, accountName, quantity, memo, [PRIVATE_KEY_TEST]);
                await handlerTransfer(tokenType, DISPENSE_ACCOUNT, accountName, quantity, memo, [PRIVATE_KEY_TEST]);
            } else {
                await client.query("ROLLBACK");
                //提现出错，代币符号不符。
                logger.error(`用户 ${ accountName } 提现时出错, error: asset symbol invalid`);
            }
        } catch (err) {
            await client.query("ROLLBACK");
            logger.error(`用户 ${ accountName } 提现时出错, EOS smart contract transfer error `, err);
        }
        await client.query("COMMIT");
        await redis.set(userWithdrawKey, format(new Date(), "YYYY-MM-DD HH:mm:ss"), "EX", 20);
    } catch (error) {
        await client.query("ROLLBACK");
        //提现出错，很大可能是异常用户。
        logger.error(`用户 ${ accountName } 提现时出错.`, error);
    } finally {
        await client.release();
    }
}

module.exports = handlerWithdraw;