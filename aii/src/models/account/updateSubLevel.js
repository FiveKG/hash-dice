// @ts-check
const { pool } = require("../../db");

/**
 * 添加下级
 * @param { any } client
 * @param { String } accountName 用户 EOS 帐号
 * @param { String[] } subAccount 用户子帐号数组
 * @returns { Promise<Array<String>> }
 */
async function updateSubLevel(client, accountName, subAccount) {
    try {
        let selectSubParentLevelSql = `
            update sub_account set sub_level = array_cat(sub_level, $1) where account_name = $2 returning sub_level;
        `
        let { rows } = await client.query(selectSubParentLevelSql, [ subAccount, accountName ]);
        return rows[0].sub_level;
    } catch (err) {
        throw err
    }
}

module.exports = updateSubLevel;