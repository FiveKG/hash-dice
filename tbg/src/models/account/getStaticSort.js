// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger");

/**
 * 递归查所有生成的子帐号 一行公排
 * @returns { Promise<{"sub_account_name":String}[]> }
 */
async function getStaticSort() {
    try {
        const sql = `
            SELECT sub_account_name FROM sub_account ORDER BY create_time ASC;
        `
        const { rows: staticSort } = await pool.query(sql);
        return staticSort;
    } catch (err) {
        logger.error("query static mode account error, the error stock is %O", err);
        throw err
    }
}

module.exports = getStaticSort;
