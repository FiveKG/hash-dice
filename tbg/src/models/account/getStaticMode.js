// @ts-check
const { pool } = require("../../db");

/**
 * 递归查所有生成的子帐号 三三静态排序
 * @returns { Promise<any> }
 */
async function getStaticMode(subAccount) {
    try {
        let selectSql = `
            WITH RECURSIVE mode AS (
                SELECT a.id, a.pid, array[a.sub_account_name] AS account FROM sub_account a
                UNION ALL
                SELECT s.id, s.pid, m.account || s.sub_account_name  FROM sub_account s INNER JOIN mode m ON m.id = s.pid
            )
            SELECT account FROM mode 
            WHERE account[array_length(account, 1)] = $1
            ORDER BY array_length(account, 1) DESC
            LIMIT 1;
        `
        
        let { rows: [ { account } ] } = await pool.query(selectSql, [ subAccount ]);
        return account;
    } catch (err) {
        throw err
    }
}

module.exports = getStaticMode;
