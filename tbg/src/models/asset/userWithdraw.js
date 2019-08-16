// @ts-check
const logger = require("../../common/logger.js").child({ "@models/asset/userWithdraw.js": "用户提现" });
const { Decimal } = require("decimal.js");
const { getUserBalance } = require("../balance");

/**
 * 用户提现
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 资产类型
 * @param { Decimal } changeAmount 变动的额度
 * @param { String } opType 操作类型
 * @param { String } remark 备注
 */
async function userWithdraw(client, accountName, changeAmount, opType, remark) {
    try {
        let rows = await getUserBalance(accountName);
        console.log("userWithdraw: user balance is ", rows);
        if (!rows) {
            throw Error("this account not exist");
        }
        let preAmount = rows.amount;
        let currentBalance = changeAmount.add(preAmount).toFixed(8);
        let updateAmountSql = `
            update balance 
                set withdraw_enable = withdraw_enable + ${ changeAmount.toFixed(8) } 
                where account_name = '${ accountName }';
            insert into 
                balance_log(
                    account_name, change_amount, current_balance, op_type, remark, create_time
                )
                values(
                    '${ accountName }', ${ changeAmount }, ${ currentBalance }, 
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