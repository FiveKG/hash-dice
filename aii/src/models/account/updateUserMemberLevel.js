// @ts-check

/**
 * 更新用户等级
 * @param { any } client
 * @param { String } accountName 用户 EOS 帐号
 * @param { Number } memberLevel 用户等级
 * @returns { Promise<any> }
 */
async function updateUserMemberLevel(client, accountName, memberLevel) {
    try {
        let selectSubParentLevelSql = `
            update account set member_level = ${ memberLevel } where account_name = '${ accountName }';
        `
        await client.query(selectSubParentLevelSql);
    } catch (err) {
        throw err
    }
}

module.exports = updateUserMemberLevel;