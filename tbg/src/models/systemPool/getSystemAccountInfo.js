// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取到的系统账户的信息
 * @returns { Promise<DB.SystemPools[]> }
 */
async function getSystemAccountInfo() {
    try {
        let selectSystemAccountSql = `
            select pool_type, pool_amount from system_pools;
        `
        let { rows } = await pool.query(selectSystemAccountSql);
        return  rows
    } catch (err) {
        throw err;
    }
}

module.exports = getSystemAccountInfo;