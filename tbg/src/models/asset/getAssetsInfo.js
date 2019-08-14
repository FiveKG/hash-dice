// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/asset/getAssetsInfo.js": "用户提现" });

/**
 * 获取资产包信息
 * @param { String } amountType 资产包类型
 * @returns { Promise<DB.AssetsPackage[]> }
 */
async function getAssetsInfo(amountType) {
    try {
        const sql = `
            SELECT * FROM assets_package WHERE amount_type = $1
        `
        const { rows } = await pool.query(sql, [ amountType ]);
        return rows;
    } catch (err) {
        logger.error("get assets_package info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getAssetsInfo;