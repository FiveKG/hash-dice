// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/asset/getUserAssetsPackage.js": "获取用户购买的资产包信息" });

/**
 * 获取用户购买的资产包信息
 * @param { String } accountName 用户账户名
 * @returns { Promise<DB.AssetsPackage[]> }
 */
async function getUserAssetsPackage(accountName) {
    try {
        const sql = `
            SELECT * FROM user_assets_package WHERE account_name = $1
        `
        const { rows } = await pool.query(sql, [ accountName ]);
        return rows;
    } catch (err) {
        logger.error("get user_assets_package info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getUserAssetsPackage;