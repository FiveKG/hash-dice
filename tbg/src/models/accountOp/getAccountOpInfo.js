// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取用户的操作日志
 * @param { String } accountName
 * @returns { Promise<any> }
 */
async function getAccountOpInfo(accountName) {
    try {
        let selectSql = `
            select * from account_op where account_name = $1
        `
        let selectResult = await pool.query(selectSql, [ accountName ]);
        return  selectResult.rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getAccountOpInfo;