// @ts-check
const { Decimal } = require("decimal.js");

/**
 * 更新系统账户资产
 * @param { any } client 指定的数据库实例
 * @param { String } changeType 资产类型
 * @param { any } changeAmount 变动的额度
 * @param { number } preAmount  变动前的额度
 * @param { string } symbolType 符号类型
 */
async function updateSystemAmount(client, changeType, changeAmount, preAmount, symbolType) {
    try {
        let currentBalance = new Decimal(changeAmount).add(preAmount).toFixed(8);
        let sql = `
            update system_pools set pool_amount = $1 where pool_type = $2 AND pool_symbol = $3;
        `
        const opts = [ currentBalance, changeType, symbolType ]
        await client.query(sql, opts);
    } catch (err) {
        console.error("update system_pools amount error, the error stock is %O", err);
        throw err;
    }
}

module.exports = updateSystemAmount;