// @ts-check

/**
 * 插入子帐号
 * @param { any } client
 * @param { SubAccount } obj 根节点用户
 */
async function insertSubAccount(client, obj, remark) {
    try {
        let insertSubAccountSql = `
            insert into sub_account values (
                '${ obj.id }', '${ obj.pid }', '${ obj.rootAccount }', '${ obj.accountName }', '${ obj.subAccount }', ${ obj.level }, ${ obj.position }, now()
            ) returning position;
            insert into account_op (account_name, op_type, remark, create_time)
            values (
                '${ obj.accountName }', 'setStaticMode', '${ remark }', now()
            );
        `
        await client.query(insertSubAccountSql);
    } catch (err) {
        throw err
    }
}

module.exports = insertSubAccount;

/**
 * @description
 * @typedef { Object } SubAccount
 * @property { String } id
 * @property { String } pid
 * @property { Number } position
 * @property { String } rootAccount
 * @property { String } accountName
 * @property { String } subAccount
 * @property { Number } level
 */