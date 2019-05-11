// @ts-check
const { pool } = require("../../db");

/**
 * 递归查所有生成的子帐号 一行公排
 * @returns { Promise<any> }
 */
async function getStaticSort() {
    try {
        let selectSql = `
            with recursive all_level as (
                select referrer_name, account_name, array[referrer_name] as account, 1 as depth from referrer 
                where referrer_name is not null and length(account_name) > 12 or length(referrer_name) > 12
                union
                select r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 as depth 
                from referrer r inner join all_level l on r.referrer_name = l.account_name
            )
            select array_append(account, account_name) as user_level
            from all_level where depth = (select max(depth) from all_level);
        `
        let { rows } = await pool.query(selectSql);
        return rows[0];
    } catch (err) {
        throw err
    }
}

module.exports = getStaticSort;
