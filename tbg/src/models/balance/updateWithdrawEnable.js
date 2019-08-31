// @ts-check
const logger = require("../../common/logger.js").child({ "@models/asset/userWithdraw.js": "用户提现" });

/**
 * 用户提现
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 用户名
 * @param { number } changeAmount 变动的额度
 */
async function userWithdraw(client, accountName, changeAmount) {
    try {
        let updateAmountSql = `
            update balance 
                set withdraw_enable = withdraw_enable + $1 
                where account_name = $2;
        `
        logger.info("update personal amount");
        await client.query(updateAmountSql, [ accountName, changeAmount ]);
        logger.info(`update '${ accountName }' amount ok`);
    } catch (err) {
        throw err;
    }
}

module.exports = userWithdraw;