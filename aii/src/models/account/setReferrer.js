// @ts-check
const { pool } = require("../../db");
const { generate_primary_key } = require("../../common");

/**
 * 绑定推荐人
 * @param { String } referrerName 推荐人
 * @param { String } accountName  被推荐用户
 * @param { String } remark 备注
 * @param { Boolean } isSubAccount 是否是设置子帐号
 */
async function setReferrer(client, referrerName, accountName, remark, isSubAccount) {
    try {
        let tmpSql = ``;
        if (!isSubAccount) {
            tmpSql = `update account set refer_count = refer_count + 1 where account_name = '${ referrerName }';`
        }

        let setReferrerSql = `
            insert into referrer (
                id, referrer_name, account_name, create_time
            ) 
            values (
                '${ generate_primary_key() }', '${ referrerName }', '${ accountName }', now()
            );
            ${ tmpSql }
            insert into account_op (account_name, op_type, remark, create_time)
            values (
                '${ accountName }', 'bind referrer', '${ remark }', now()
            );
        `
        await client.query(setReferrerSql);
    } catch (err) {
        throw err
    }
}

module.exports = setReferrer;