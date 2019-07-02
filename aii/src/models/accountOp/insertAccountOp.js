// @ts-check

/**
 * 插入子帐号
 * @param { any } client
 * @property { String } accountName 操作账号
 * @property { String } opType 操作类型
 * @property { String } remark 备注
 */
async function insertAccountOp(client, accountName, opType, remark) {
    try {
        let insertAccountOpSql = `
            INSERT INTO account_op(account_name, op_type, remark, create_time)
            VALUES ($1, $2, $3, now());
        `
        await client.query(insertAccountOpSql, [ accountName, opType, remark ]);
    } catch (err) {
        console.error("insert data to account_op error, the error stock is %O", err);
        throw err
    }
}

module.exports = insertAccountOp;