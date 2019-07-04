// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger");

/**
 * 递归查所有生成的子帐号 一行公排
 * @returns { Promise<any> }
 */
async function getStaticSort() {
    try {
        const sql = `
            WITH res AS (
                WITH RECURSIVE all_level AS (
                    SELECT referrer_name, account_name, ARRAY[referrer_name] AS account, 1 AS depth 
                        FROM referrer 
                        WHERE referrer_name = ''
                    UNION
                    SELECT r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 AS depth 
                        FROM referrer r 
                        INNER JOIN all_level l ON r.referrer_name = l.account_name
                )
                SELECT referrer_name, account_name, array_append(account, account_name) AS user_level, depth 
                    FROM all_level 
                    WHERE length(account_name) > 12
            )
            SELECT * FROM res WHERE depth = (select max(depth) from res);
        `
        const { rows: [ staticSort ] } = await pool.query(sql);
        return staticSort;
    } catch (err) {
        logger.error("query static mode account error, the error stock is %O", err);
        throw err
    }
}

module.exports = getStaticSort;
