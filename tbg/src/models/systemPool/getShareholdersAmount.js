// @ts-check
const { pool } = require("../../db/index.js");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");

/**
 * 获取系统用户信息
 * @returns { Promise<SystemPool> }
 */
async function getShareholdersAmount() {
    try {
        let selectSql = `
            select pool_amount from system_pools where pool_type = $1;
        `
        let selectResult = await pool.query(selectSql, [ SHAREHOLDERS_POOL ]);
        return  selectResult.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = getShareholdersAmount;

/**
 * @description 获取到的系统账户的信息
 * @typedef { Object } SystemPool
 * @property { number } pool_amount
 */