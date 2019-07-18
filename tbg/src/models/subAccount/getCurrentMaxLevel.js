// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger");

/**
 * 获取当前三三公排某个树的最大层级
 * @param { String } accountName
 * @returns { Promise<Number> }
 */
async function getCurrentMaxLevel(accountName) {
    try {
        let currentMaxLevel = `
            SELECT max(level) AS max_level 
                FROM sub_account 
                WHERE root_node = ( SELECT DISTINCT root_node FROM sub_account WHERE main_account = $1);
        `
        let { rows: [ { max_level } ] } = await pool.query(currentMaxLevel, [ accountName ]);
        return max_level;
    } catch (err) {
        logger.error("get sub_account max level error, the error stock is %O", err);
        throw err
    }
}

module.exports = getCurrentMaxLevel;