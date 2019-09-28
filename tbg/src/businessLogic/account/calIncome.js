// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "Calculated income" });
const { getStaticSort } = require("../../models/account");
const staticModeIncome = require("./staticModeIncome.js");
const staticSortIncome = require("./staticSortIncome.js");
const { redis } = require("../../common/index.js");

/**
 * 计算收益
 * @param { number } amount 投资额度， decimal 类型
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
        // 查找收益不过线的键
        const keysList = await redis.keys("tbg:subAccountSort:*");
        // 从 redis 键中过滤出所有子账号
        const subAccountList = keysList.map(item => item.split(":")[2]);
        // 筛选后分配收益
        const allSubAccountList = rows.map(item => item.sub_account_name);
        const staticSortList = allSubAccountList.filter(item => subAccountList.includes(item));
        // 分配一行公排静态收益
        await staticSortIncome(client, amount, staticSortList);
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