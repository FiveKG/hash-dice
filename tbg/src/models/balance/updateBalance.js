// @ts-check
const logger = require("../../common/logger.js");
const { 
    WITHDRAW_ENABLE,
    REPEAT_CURRENCY, 
    LOTTO_CURRENCY, 
    GAME_CURRENCY, BASE_RATE 
} = require("../../common/constant/balanceConstants.js")

/**
 * 更新用户资产
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 资产类型
 * @param { any } changeAmount 变动的额度
 */
async function updateBalance(client, accountName, changeAmount) {
    try {
        let updateAmountSql = `
            UPDATE balance 
            SET withdraw_enable = withdraw_enable + $1, 
                repeat_currency = repeat_currency + $2,  
                lotto_currency = lotto_currency + $3, 
                game_currency = game_currency + $4 
            WHERE account_name = $5;
        `
        logger.info("update personal amount");
        const opts = [ 
            changeAmount.mul(WITHDRAW_ENABLE / BASE_RATE).toFixed(8), 
            changeAmount.mul(REPEAT_CURRENCY / BASE_RATE).toFixed(8),
            changeAmount.mul(LOTTO_CURRENCY / BASE_RATE).toFixed(8),
            changeAmount.mul(GAME_CURRENCY / BASE_RATE).toFixed(8),
            accountName
        ]
        console.debug("the sql is %s, the opts is %O", updateAmountSql, opts);
        await client.query(updateAmountSql, opts);
        logger.info(`update '${ accountName }' amount ok`);
    } catch (err) {
        logger.error("update %s amount error, the error stock is %O", accountName, err);
        throw err;
    }
}

module.exports = updateBalance;