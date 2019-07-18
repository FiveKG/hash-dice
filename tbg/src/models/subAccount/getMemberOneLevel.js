// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger")

/**
 * 获取某层的所有帐号数
 * @param { Number } level
 * @param { String } accountName
 */
async function getMemberOneLevel(level, accountName) {
    try {
        let memberOneLevel = `
            SELECT * 
                FROM sub_account 
                WHERE level = $1
                AND root_node = (SELECT DISTINCT root_node FROM sub_account WHERE main_account = $2)
        `
        let { rows } = await pool.query(memberOneLevel, [ level, accountName ]);
        return rows;
    } catch (err) {
        logger.error("get one level sub-account member error, the error stock is %O", err);
        throw err
    }
}

module.exports = getMemberOneLevel;