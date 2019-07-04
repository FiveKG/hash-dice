// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 查询用户的子帐号
 * @param { String } rootNode 用户 EOS 帐号
 * @returns { Promise<any> }
 */
async function getSubAccountInfoByRootNode(rootNode) {
    try {
        let sql = `
            SELECT * FROM sub_account WHERE root_node = $1 limit 1;
        `
        let { rows: [ subAccountInfo ] } = await pool.query(sql, [ rootNode ]);
        return subAccountInfo;
    } catch (err) {
        throw err
    }
}

module.exports = getSubAccountInfoByRootNode;