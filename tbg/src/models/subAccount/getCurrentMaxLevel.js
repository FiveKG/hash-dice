// @ts-check
const { pool } = require("../../db");

/**
 * 获取当前三三公排某个树的最大层级
 * @param { String } rootAccount 根节点用户
 * @returns { Promise<Number> }
 */
async function getCurrentMaxLevel(rootAccount) {
    try {
        let currentMaxLevel = `
            select max(level) as max_level from sub_account where root_node = $1;
        `

        let { rows } = await pool.query(currentMaxLevel, [ rootAccount ]);
        return rows[0].max_level;
    } catch (err) {
        throw err
    }
}

module.exports = getCurrentMaxLevel;