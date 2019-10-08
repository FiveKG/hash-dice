// @ts-check
const { pool } = require("../../db");

/**
 * 递归查所有上级
 * @param { String } accountName 用户 EOS 帐号
 * @returns { Promise<any> }
 */
async function getAllParentLevel(accountName) {
    try {
        let selectAllParentLevelSql = `
            WITH etc AS (
                WITH recursive all_level AS (
                    SELECT referrer_name, account_name, array[referrer_name] AS account, 1 AS depth FROM referrer 
                    WHERE referrer_name = '' and account_name !~ '-'
                    UNION
                    SELECT r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 AS depth 
                    FROM referrer r inner join all_level l on r.referrer_name = l.account_name
                )
                SELECT referrer_name, account_name, array_append(account, account_name) AS user_level, depth FROM all_level
            )
            SELECT user_level FROM etc WHERE user_level[array_length(user_level, 1)] = $1;
        `
        let { rows: [ { user_level } ] } = await pool.query(selectAllParentLevelSql, [ accountName ]);
        return user_level;
    } catch (err) {
        throw err
    }
}

module.exports = getAllParentLevel;
