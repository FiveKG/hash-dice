// @ts-check
const logger = require("../../common/logger.js");
const { 
    WITHDRAW_ENABLE,
    REPEAT_CURRENCY, 
    LOTTO_CURRENCY, 
    GAME_CURRENCY, BASE_RATE 
} = require("../../common/constant/balanceConstants.js")

/**
 * 更新用户的复投资产
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 资产类型
 * @param { any } changeAmount 变动的额度
 * @returns { Promise<number> }
 */
async function updateRepeatBalance(client, accountName, changeAmount) {
    try {
        let updateAmountSql = `
            UPDATE balance 
            SET repeat_currency = repeat_currency - $1
            WHERE account_name = $2
            RETURNING repeat_currency;
        `
        logger.info("update personal amount");
        const opts = [ changeAmount, accountName ]
        console.debug("the sql is %s, the opts is %O", updateAmountSql, opts);
        const { rows: [ { repeat_currency } ] } = await client.query(updateAmountSql, opts);
        logger.info(`update '${ accountName }' amount ok`);
        return repeat_currency;
    } catch (err) {
        logger.error("update %s repeat amount error, the error stock is %O", accountName, err);
        throw err;
    }
}

module.exports = updateRepeatBalance;