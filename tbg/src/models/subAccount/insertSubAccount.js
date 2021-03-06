// @ts-check
const logger = require("../../common/logger.js");

/**
 * 插入子帐号
 * @param { any } client
 * @param { SubAccount } obj 根节点用户
 */
async function insertSubAccount(client, obj) {
    try {
        const insertSubAccountSql = `
            INSERT INTO sub_account(id, pid, root_node, main_account, sub_account_name, level, position, create_time)
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, now()
            ) returning position;
        `
        const opts = [ obj.id, obj.pid, obj.rootAccount, obj.accountName, obj.subAccount, obj.level, obj.position ]
        await client.query(insertSubAccountSql, opts);
    } catch (err) {
        logger.error("insert sub-account error, the error stock is %O", err);
        throw err
    }
}

module.exports = insertSubAccount;

/**
 * @description
 * @typedef { Object } SubAccount
 * @property { String } id
 * @property { String } pid
 * @property { number } position
 * @property { String } rootAccount
 * @property { String } accountName
 * @property { String } subAccount
 * @property { number } level
 */