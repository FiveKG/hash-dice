// @ts-check
const logger = require("../../common/logger.js");

/**
 * 更新用户状态
 * @param { any } client
 * @param { String } accountName
 */
async function updateAccountState(client, state, accountName) {
    try {
        const updateAccountStateSql = `
            UPDATE account 
                SET state = $1
                WHERE account_name = $2;`
        await client.query(updateAccountStateSql, [ state, accountName ]);
    } catch (err) {
        logger.error("update account state error, the error stock is %O", err);
        throw err
    }
}

module.exports = updateAccountState;