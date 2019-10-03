// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "生成记录快照信息" });
const df = require("date-fns");

/**
 * 生成记录快照信息
 * @param { string } accountName 
 */
async function genSnapshot(accountName) {
    try {
        const sqlList = [];
        // 查找所有上级
        const selectAllParentLevelSql = `
            WITH etc AS (
                WITH recursive all_level AS (
                    SELECT referrer_name, account_name, array[referrer_name] AS account, 1 AS depth FROM referrer 
                    WHERE referrer_name = '' AND account_name !~ '-'
                    UNION
                    SELECT r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 AS depth 
                    FROM referrer r INNER JOIN all_level l ON r.referrer_name = l.account_name
                )
                SELECT referrer_name, account_name, account AS user_level, depth FROM all_level
            )
            SELECT user_level FROM etc WHERE user_level[array_length(user_level, 1)] = $1
        `
        let { rows: [ { user_level: referrerAccountList } ] } = await pool.query(selectAllParentLevelSql, [ accountName ]);
        logger.debug("referrerAccountList: ", referrerAccountList);
        const selectSnapshotSql = `SELECT * FROM snapshot WHERE account_name = $1`;
        // 向上回朔，增加上级的相应人数
        const optsMap = new Map();
        for (let i = 0; i < referrerAccountList.length; i++) {
            const referrer = referrerAccountList[i];
            if (referrer === '' || referrer === accountName) {
                continue;
            }

            // 查找快照中的记录
            const { rows: [ snapshotInfo ] } = await pool.query(selectSnapshotSql, [ accountName ]);
            logger.debug("snapshotInfo: ", snapshotInfo);
            let v = 0, v1 = 0, v2 = 0, v3 = 0, v4 = 0, v5 = 0;
            if (!!snapshotInfo) {
                // 如果推荐人数大于 100，升级为达标用户
                if (snapshotInfo.effective_member + 1 === 100) {
                    v = 1;
                    // 修改推荐人的用户等级
                    const { rows: [ refSnapshotInfo ] } = await pool.query(selectSnapshotSql, [ referrerAccountList[ i - 1 ] ]);     
                    logger.debug("refSnapshotInfo: ", refSnapshotInfo);
                    if (refSnapshotInfo.standard_v + v === 3) {
                        v1 = 1
                    }
                    if (refSnapshotInfo.standard_v1 + v1 === 3) {
                        v2 = 1
                    }
    
                    if (refSnapshotInfo.standard_v2 + v2 === 3) {
                        v3 = 1
                    }
    
                    if (refSnapshotInfo.standard_v3 + v3 === 3) {
                        v4 = 1
                    }
    
                    if (refSnapshotInfo.standard_v4 + v4 === 3) {
                        v5 = 1
                    }
                    const opts = [ referrerAccountList[ i - 1 ], 1, {}, 1, 0, 0, 0, 0, 0, 0, 1, 'now()', 1, 1, v, v1, v2, v3, v4, v5, 1 ];
                    optsMap.set(referrerAccountList[ i - 1 ], opts);
                }
            }

            const opts = [ accountName, 1, {}, 1, 0, 0, 0, 0, 0, 0, 1, 'now()', 1, 1, v, 0, 0, 0, 0, 0, 1 ];
            
            optsMap.set(accountName, opts);
        }

        // 新增数据
        const upsertSnapshotSql = `
            INSERT INTO snapshot(account_name, invite_count_week, tree_level, invite_member_count, standard_v, 
                    standard_v1, standard_v2, standard_v3, standard_v4, standard_v5, effective_member, create_time)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (account_name)
                DO UPDATE SET 
                    invite_count_week = EXCLUDED.invite_count_week + $13, 
                    invite_member_count = EXCLUDED.invite_member_count + $14, 
                    standard_v = EXCLUDED.standard_v + $15, 
                    standard_v1 = EXCLUDED.standard_v1 + $16, 
                    standard_v2 = EXCLUDED.standard_v2 + $17, 
                    standard_v3 = EXCLUDED.standard_v3 + $18, 
                    standard_v4 = EXCLUDED.standard_v4 + $19, 
                    standard_v5 = EXCLUDED.standard_v5 + $20,
                    effective_member = EXCLUDED.effective_member + $21
        `
        for (const [ key, val ] of optsMap) {
            sqlList.push({ sql: upsertSnapshotSql, values: val });
        }

        logger.debug("sqlList: ", sqlList);
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            logger.error("transaction error: ", err);
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        logger.error("snapshot error: ", err);
        throw err;
    }
}

module.exports = genSnapshot