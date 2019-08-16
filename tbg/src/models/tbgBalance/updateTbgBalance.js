// @ts-check
const logger = require("../../common/logger.js");

/**
 * 更新用户资产
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 资产类型
 * @param { number } release_amount 释放池资产
 * @param { number } sell_amount 可售额度
 * @param { number } active_amount 可售余额
 */
async function updateTbgBalance(client, accountName, release_amount, sell_amount, active_amount) {
    try {
        let updateAmountSql = `
            UPDATE tbg_balance 
                SET release_amount = release_amount + $1, 
                    sell_amount = sell_amount + $2,  
                    active_amount = active_amount + $3
                WHERE account_name = $4
        `
        const opts = [ release_amount, sell_amount, active_amount, accountName ]
        logger.debug("the sql is %s, the opts is %O", updateAmountSql, opts);
        await client.query(updateAmountSql, opts);
        logger.info(`update '${ accountName }' tbg_balance ok`);
    } catch (err) {
        logger.error("update %s tbg_balance error, the error stock is %O", accountName, err);
        throw err;
    }
}

module.exports = updateTbgBalance;