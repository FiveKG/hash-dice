// @ts-check
const { pool } = require("../../db/index.js");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants");

/**
 * 获取系统用户信息
 * @returns { Promise<SystemPool> }
 */
async function getShareholdersAmount() {
    try {
        let selectSql = `
            select pool_amount from system_pools where pool_type = $1 AND pool_symbol = $2;
        `
        let selectResult = await pool.query(selectSql, [ SHAREHOLDERS_POOL, UE_TOKEN_SYMBOL ]);
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