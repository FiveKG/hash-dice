// @ts-check
const logger = require("../../common/logger.js");
const { Decimal } = require("decimal.js");
const { getUserBalance } = require("../balance");
const { WITHDRAW_ENABLE, REPEAT_CURRENCY, LOTTO_CURRENCY, GAME_CURRENCY} = require("../../common/constant/balanceConstants.js")
/**
 * 系统资产变动
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 资产类型
 * @param { Decimal } changeAmount 变动的额度
 * @param { String } opType 操作类型
 * @param { String } remark 备注
 * @param { any } now 插入数据的时间
 */
async function personalAssetChange(client, accountName, changeAmount, opType, remark, now) {
    try {
        let rows = await getUserBalance(accountName);
        if (!rows) {
            throw Error("this account not exist");
        }
        let preAmount = rows.amount;
        let currentBalance = changeAmount.add(preAmount).toFixed(8);
        let updateAmountSql = `
            update balance set withdraw_enable = withdraw_enable + ${ changeAmount.mul(WITHDRAW_ENABLE / 100).toFixed(8) } where account_name = '${ accountName }';
            update balance set repeat_currency = repeat_currency + ${ changeAmount.mul(REPEAT_CURRENCY / 100).toFixed(8) } where account_name = '${ accountName }';
            update balance set lotto_currency = lotto_currency + ${ changeAmount.mul(LOTTO_CURRENCY / 100).toFixed(8) } where account_name = '${ accountName }';
            update balance set game_currency = game_currency + ${ changeAmount.mul(GAME_CURRENCY / 100).toFixed(8) } where account_name = '${ accountName }';
            insert into 
                balance_log(
                    account_name, change_amount, current_balance, op_type, remark, create_time
                )
                values(
                    '${ accountName }', ${ changeAmount }, ${ currentBalance }, 
                    '${ opType }', '${ remark }', '${ now }'
                );
        `
        logger.info("update personal amount");
        console.log(`now: ${ now } -- preAmount: ${ preAmount } -- currentBalance: ${ currentBalance } -- updateAmountSql: ${ updateAmountSql }`);
        await client.query(updateAmountSql);
        logger.info(`update '${ accountName }' amount ok`);
    } catch (err) {
        throw err;
    }
}

module.exports = personalAssetChange;