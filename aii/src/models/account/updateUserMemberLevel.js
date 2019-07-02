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
            update account set member_level = $1 where account_name = $2;
        `
        await client.query(selectSubParentLevelSql, [ memberLevel, accountName ]);
    } catch (err) {
        throw err
    }
}

module.exports = updateUserMemberLevel;