// @ts-check

/**
 * 更新推荐人数
 * @param { any } client
 * @param { String } referrerName 推荐人
 */
async function updateReferCount(client, referrerName) {
    try {
        const updateReferCountSql = `
            UPDATE account 
                SET refer_count = refer_count + 1 
                WHERE account_name = $1;`
        await client.query(updateReferCountSql, [ referrerName ]);
    } catch (err) {
        throw err
    }
}

module.exports = updateReferCount;