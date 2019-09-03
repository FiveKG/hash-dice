// @ts-check
const { pool } = require("../../db/index.js");
const { SAFE_POOL } = require("../../common/constant/accountConstant.js");
const { PROTECTION } = require("../../common/constant/optConstants");

/**
 * 获取系统用户信息
 * @returns { Promise<SystemPool> }
 */
async function getSafeHistory() {
    try {
        let selectSql = `
            select sum(change_amount) as issue from system_op_log where op_type = $1;
        `
        let selectResult = await pool.query(selectSql, [ PROTECTION ]);
        return  selectResult.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = getSafeHistory;

/**
 * @description 获取到的系统账户的信息
 * @typedef { Object } SystemPool
 * @property { number } issue
 */