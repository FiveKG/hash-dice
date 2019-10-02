// @ts-check
const { pool, psTrx } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "生成记录快照信息" });
const df = require("date-fns");

/**
 * 生成记录快照信息
 * @param { string } accountName 
 */
async function genSnapshot(accountName) {
    try {
        const sqlList = [];
        const tableName = `snapshot`;
        const selectSnapshotExistsSql = `SELECT count(1)::INTEGER FROM pg_class WHERE relname = $1`;
        const { rows: [ { count } ] } = await pool.query(selectSnapshotExistsSql, [ tableName ]);
        // 先查有没有快照表，有的话直接使用快照
        // 否则先递归出所有的层级关系，生成一个快照表，表名可以为 YYYY-MM-DD-snapshot
        if (count === 0) {
            const createTableSql = `
                CREATE TABLE IF NOT EXISTS ${ tableName } (
                    id serial PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
                    account_name TEXT UNIQUE NOT NULL DEFAULT '',
                    invite_account_week INTEGER NOT NULL DEFAULT 0;
                    tree_level JSON NOT NULL DEFAULT '{}'::JSONB;
                    invite_member_count INTEGER NOT NULL DEFAULT 0;
                    standard_v INTEGER NOT NULL DEFAULT 0;
                    standard_v1 INTEGER NOT NULL DEFAULT 0;
                    standard_v2 INTEGER NOT NULL DEFAULT 0;
                    standard_v3 INTEGER NOT NULL DEFAULT 0;
                    standard_v4 INTEGER NOT NULL DEFAULT 0;
                    standard_v5 INTEGER NOT NULL DEFAULT 0;
                    effective_member INTEGER NOT NULL DEFAULT 0;
                    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                )
            `
            try {
                const { rows } = await pool.query(createTableSql);
                logger.debug("create snapshot success, ", rows);
            } catch (err) {
                logger.error("create snapshot error: ", err);
                throw err;
            }
        }

        const upsertSnapshotSql = `
            INSERT INTO ${ tableName } 
                (account_name, invite_account_week, account_level, invite_member_count, standard_v, 
                    standard_v1, standard_v2, standard_v3, standard_v4, standard_v5, effective_member, create_time)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 12)
                ON CONFLICT 
                DO UPDATE SET 
                    invite_account_week = invite_account_week + $13, 
                    invite_member_count = invite_member_count + $14, 
                    standard_v = standard_v + $15, 
                    standard_v1 = standard_v1 + $16, 
                    standard_v2 = standard_v2 + $17, 
                    standard_v3 = standard_v3 + $18, 
                    standard_v4 = standard_v4 + $19, 
                    standard_v5 = standard_v5 + $20,
                    effective_member = effective_member + $21
        `

        const selectAllParentLevelSql = `
            WITH etc AS (
                WITH recursive all_level AS (
                    SELECT referrer_name, account_name, array[referrer_name] AS account, 1 AS depth FROM referrer 
                    WHERE referrer_name = '' and account_name !~ '-'
                    UNION
                    SELECT r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 AS depth 
                    FROM referrer r inner join all_level l on r.referrer_name = l.account_name
                )
                SELECT referrer_name, account_name, account AS user_level, depth FROM all_level
            )
            SELECT user_level FROM etc WHERE user_level[array_length(user_level, 1)] = $1;
        `
        let { rows: [ { user_level: referrerAccountList } ] } = await pool.query(selectAllParentLevelSql, [ accountName ]);
        for (const referrer of referrerAccountList) {
            if (referrer === '' || referrer === accountName) {
                continue;
            }

            // 查找快照中的记录
            const selectSnapshotSql = `SELECT * FROM snapshot WHERE account_name = $1`;
            const { rows: [ snapshotInfo ] } = await pool.query(selectSnapshotSql, [ accountName ]);

            let v = 0, v1 = 0, v2 = 0, v3 = 0, v4 = 0, v5 = 0;
            if (!!snapshotInfo) {
                if (referrerAccountList.length === 101) {
                    v = 1;
                }

                if (snapshotInfo.standard_v + v === 3) {
                    v1 = 1
                }

                if (snapshotInfo.standard_v1 + v1 === 3) {
                    v2 = 1
                }

                if (snapshotInfo.standard_v2 + v2 === 3) {
                    v3 = 1
                }

                if (snapshotInfo.standard_v3 + v3 === 3) {
                    v4 = 1
                }

                if (snapshotInfo.standard_v4 + v4 === 3) {
                    v5 = 1
                }
            }
            const opts = [ accountName, 1, {}, 1, 0, 0, 0, 0, 0, 0, 1, 'now()', 1, 1, v, v1, v2, v3, v4, v5, 1 ]
            sqlList.push({ sql: upsertSnapshotSql, values: opts });
        }

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        logger.error("snapshot error: ", err)
        throw err;
    }
}

module.exports = genSnapshot