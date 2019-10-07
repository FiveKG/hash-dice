// @ts-check

/**
 * 添加用户信息
 * @param { any } client 指定的数据库实例
 * @param { String } accountName 用户名
 */
async function insertAccountSnapshot(client, accountName) {
    try {
        let sql = `
            INSERT INTO snapshot(account_name, account_grade, invite_count_week, tree_level, invite_member_count, standard_v0, 
                standard_v1, standard_v2, standard_v3, standard_v4, effective_member, create_time)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `
        const opts = [ accountName, "v0", 0, {}, 0, 0, 0, 0, 0, 0, 0, 'now()' ]
        // console.debug("the sql is %s, the values is %O", sql, opts);
        await client.query(sql, opts);
    } catch (err) {
        console.error("insert data to account snapshot error, the error stock is %O", err);
        throw err;
    }
}

module.exports = insertAccountSnapshot;