// @ts-check
const { pool } = require("../../db/index.js");
const { SHAREHOLDERS_POOL } = require("../../common/constant/accountConstant.js");

/**
 * 获取系统用户信息
 * @returns { Promise<SystemPool> }
 */
async function getHolderHistory() {
    try {
        let selectSql = `
            select sum(change_amount) as issue from system_op_log where op_type = $1;
        `
        let selectResult = await pool.query(selectSql, [ `allocating ${ SHAREHOLDERS_POOL }` ]);
        return  selectResult.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = getHolderHistory;

/**
 * @description 获取到的系统账户的信息
 * @typedef { Object } SystemPool
 * @property { number } issue
 */