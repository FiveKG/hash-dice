// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/models/account/userInvestment.js": "Calculated income" });
const { getStaticSort } = require("../../models/account");
const staticModeIncome = require("./staticModeIncome.js");
const staticSortIncome = require("./staticSortIncome.js");

/**
 * 计算收益
 * @param { Number } amount 投资额度， decimal 类型
 * @param { String } newSubAccount 子账号
 */
async function calIncome(amount, newSubAccount) {
    let client = await pool.connect();
    await client.query("BEGIN");
    try {       
        // 分配三三静态收益
        await staticModeIncome(client, amount, newSubAccount)
        // 一行公排的查出所有子帐号
        const rows = await getStaticSort();
        if (rows.length === 0) {
            return;
        }
        // 分配一行公排静态收益
        const staticSort = rows.map(item => item.sub_account_name);
        await staticSortIncome(client, amount, staticSort);
        await client.query("COMMIT");
    } catch (err) {
        logger.error("user investment error, the error stock is %O", err);
        await client.query("ROLLBACK");
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = calIncome