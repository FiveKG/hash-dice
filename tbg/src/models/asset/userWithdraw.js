// @ts-check
const logger = require("../../common/logger.js").child({ "@models/asset/userWithdraw.js": "用户提现" });
const { Decimal } = require("decimal.js");
const { getUserBalance } = require("../balance");

/**
 * 用户提现
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 用户名
 * @param { number } changeAmount 提现的额度
 * @param { number } currentBalance 当前余额
 * @param { any } extra 
 * @param { String } opType 操作类型
 * @param { String } remark 备注
 */
async function userWithdraw(client, accountName, changeAmount, currentBalance, extra, opType, remark) {
    try {
        let updateAmountSql = `
            update balance 
                set withdraw_enable = withdraw_enable + ${ changeAmount.toFixed(8) } 
                where account_name = '${ accountName }';
            insert into 
                balance_log(
                    account_name, change_amount, current_balance, extra, op_type, remark, create_time
                )
                values(
                    '${ accountName }', ${ changeAmount }, ${ currentBalance }, ${ extra }
                    '${ opType }', '${ remark }', now()
                );
        `
        logger.info("update personal amount");
        await client.query(updateAmountSql);
        logger.info(`update '${ accountName }' amount ok`);
    } catch (err) {
        throw err;
    }
}

module.exports = userWithdraw;