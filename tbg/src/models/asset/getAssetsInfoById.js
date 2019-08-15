// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@models/asset/getAssetsInfoById.js": "获取资产包信息" });

/**
 * 获取资产包信息
 * @param { number[] } id 资产包 id
 * @returns { Promise<DB.AssetsPackage[]> }
 */
async function getAssetsInfoById(id) {
    try {
        const sql = `
            SELECT * FROM assets_package WHERE id = any($1)
        `
        const { rows: assetsInfo } = await pool.query(sql, [ [ id ] ]);
        return assetsInfo;
    } catch (err) {
        logger.error("get assets_package info error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getAssetsInfoById;