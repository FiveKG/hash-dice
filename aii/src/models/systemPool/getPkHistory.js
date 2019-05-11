// @ts-check
const { pool } = require("../../db/index.js");
const { PK_POOL } = require("../../common/constant/accountConstant.js");

/**
 * 获取系统用户信息
 * @returns { Promise<SystemPool> }
 */
async function getPkHistory() {
    try {
        let selectSql = `
            select sum(change_amount) as issue from system_op_log where op_type = 'allocating ${ PK_POOL }';
        `
        let selectResult = await pool.query(selectSql);
        return  selectResult.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = getPkHistory;

/**
 * @description 获取到的系统账户的信息
 * @typedef { Object } SystemPool
 * @property { Number } issue
 */