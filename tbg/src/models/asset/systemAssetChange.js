// @ts-check
const logger = require("../../common/logger.js");
const { Decimal } = require("decimal.js");

/**
 * 系统资产变动
 * @param { any } client 指定的数据库实例
 * @param { String } changeType 资产类型
 * @param { Decimal } changeAmount 变动的额度
 * @param { Number } preAmount  变动前的额度
 * @param { String } opType 操作类型
 * @param { String } remark 备注
 */
async function systemAssetChange(client, changeType, changeAmount, preAmount, opType, remark) {
    try {
        let currentBalance = changeAmount.add(preAmount).toFixed(8);
        let updateAmountSql = `
            update system_pools set pool_amount = $1 where pool_type = $2;
            insert into 
                system_op_log(change_amount, current_balance, op_type, remark, create_time)
                values($3, $1, $4, $5, $6);
        `
        logger.info("update system_pools amount");
        const opts = [ currentBalance, changeType, changeAmount.toFixed(8), opType, remark, "now()" ]
        await client.query(updateAmountSql, opts);
        logger.info(`update '${ changeType }' amount ok`);
    } catch (err) {
        throw err;
    }
}

module.exports = systemAssetChange;