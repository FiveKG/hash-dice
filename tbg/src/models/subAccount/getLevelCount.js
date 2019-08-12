// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger");

/**
 * 获取当前三三公排某个树的最大层级
 * @param { String } accountName
 * @returns { Promise<number> }
 */
async function getLevelCount(accountName) {
    try {
        let currentMaxLevel = `
            SELECT count(1) AS count 
                FROM sub_account 
                WHERE level = (
                    SELECT max(level) 
                        FROM sub_account 
                        WHERE root_node = (
                            SELECT DISTINCT root_node 
                            FROM sub_account 
                            WHERE main_account = $1))
        `
        let { rows: [ { count } ] } = await pool.query(currentMaxLevel, [ accountName ]);
        return count;
    } catch (err) {
        logger.error("get sub_account max level error, the error stock is %O", err);
        throw err
    }
}

module.exports = getLevelCount;