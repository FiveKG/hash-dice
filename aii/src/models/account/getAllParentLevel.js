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
            with etc as (
                with recursive all_level as (
                    select referrer_name, account_name, array[referrer_name] as account, 1 as depth from referrer 
                    where referrer_name is null and length(account_name) = 12
                    union
                    select r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 as depth 
                    from referrer r inner join all_level l on r.referrer_name = l.account_name
                )
                select referrer_name, account_name, array_append(account, account_name) as user_level, depth from all_level
            )
            select user_level from etc where user_level[array_length(user_level, 1)] = '${ accountName }';
        `
        let { rows } = await pool.query(selectAllParentLevelSql);
        return rows[0].user_level;
    } catch (err) {
        throw err
    }
}

module.exports = getAllParentLevel;
