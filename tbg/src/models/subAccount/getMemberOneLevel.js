// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 获取某层的所有帐号数
 * @param { String } rootAccount 根节点用户
 */
async function getMemberOneLevel(rootAccount) {
    try {
        let memberOneLevel = `
            select position from sub_account where level = (select max(level) from sub_account) and root_node = $1;
        `
        let { rows } = await pool.query(memberOneLevel, [ rootAccount ]);
        return rows;
    } catch (err) {
        throw err
    }
}

module.exports = getMemberOneLevel;