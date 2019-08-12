// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取系统用户信息
 * @returns { Promise<SystemPool> }
 */
async function getOneAccount(changeType) {
    try {
        let selectSystemAccountSql = `
            select pool_amount from system_pools where pool_type = $1;
        `
        let selectResult = await pool.query(selectSystemAccountSql, [ changeType ]);
        return  selectResult.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = getOneAccount;

/**
 * @description 获取到的系统账户的信息
 * @typedef { Object } SystemPool
 * @property { number } pool_amount
 */