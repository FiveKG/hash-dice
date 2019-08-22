// @ts-check
const { Decimal } = require("decimal.js");

/**
 * 更新系统账户资产
 * @param { any } client 指定的数据库实例
 * @param { String } changeType 资产类型
 * @param { any } changeAmount 变动的额度
 * @param { number } preAmount  变动前的额度
 */
async function updateSystemAmount(client, changeType, changeAmount, preAmount) {
    try {
        let currentBalance = new Decimal(changeAmount).add(preAmount).toFixed(8);
        let sql = `
            update system_pools set pool_amount = $1 where pool_type = $2;
        `
        const opts = [ currentBalance, changeType ]
        await client.query(sql, opts);
    } catch (err) {
        console.error("update system_pools amount error, the error stock is %O", err);
        throw err;
    }
}

module.exports = updateSystemAmount;