// @ts-check
const { pool } = require("../../db");

/**
 * 递归查所有生成的子帐号 一行公排
 * @returns { Promise<any> }
 */
async function getStaticMode(subAccount) {
    try {
        let selectSql = `
            with recursive mode as (
                select a.id, a.pid, array[a.sub_account_name] as account from sub_account a
                union all
                select s.id, s.pid, m.account || s.sub_account_name  from sub_account s inner join mode m on m.id = s.pid
                )
                select account from mode 
                where account[array_length(account, 1)] = $1
                order by array_length(account, 1) desc 
                limit 1;
        `
        
        let { rows } = await pool.query(selectSql, [ subAccount ]);
        return rows[0];
    } catch (err) {
        throw err
    }
}

module.exports = getStaticMode;
