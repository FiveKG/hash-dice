// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取系统用户信息
 * @returns { Promise<SystemPool[]> }
 */
async function getSystemAccountInfo() {
    try {
        let selectSystemAccountSql = `
            select pool_type, pool_amount from system_pools;
        `
        let selectResult = await pool.query(selectSystemAccountSql);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getSystemAccountInfo;

/**
 * @description 获取到的系统账户的信息
 * @typedef { Object } SystemPool
 * @property { String } pool_type
 * @property { Number } pool_amount
 */