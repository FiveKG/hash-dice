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
                SELECT referrer_name, account_name, array_append(account, account_name) AS user_level, depth FROM all_level
            )
            SELECT user_level FROM etc WHERE user_level[array_length(user_level, 1)] = $1
        `
        let { rows: [ { user_level: referrerAccountList } ] } = await pool.query(selectAllParentLevelSql, [ accountName ]);
        logger.debug("referrerAccountList: ", referrerAccountList);
        const selectSnapshotSql = `SELECT * FROM snapshot WHERE account_name = $1`;
        const selectSubLevelSql = `SELECT * FROM snapshot WHERE account_name = any(SELECT account_name FROM referrer WHERE referrer_name = $1)`
        // 向上回朔，增加上级的相应人数
        const optsMap = new Map();
        const len = referrerAccountList.length;
        for (let i =  len - 1; i > 0; i--) {
            const referrer = referrerAccountList[i];
            if (referrer === '' || referrer === accountName) {
                continue;
            }

            // 查找快照中的记录
            const { rows: [ snapshotInfo ] } = await pool.query(selectSnapshotSql, [ referrer ]);
            logger.debug("snapshotInfo: ", snapshotInfo);
            let v0 = 0;
            let grade = "v"
            if (!!snapshotInfo) {
                // 用户推荐人数大于 100 时，伞下有可能有达标用户
                if (snapshotInfo.effective_member > 100) {
                    // 下级直推用户的快照
                    const { rows: subSnapshotInfo } = await pool.query(selectSubLevelSql, [ referrer ]);
                    const standard_v0 = subSnapshotInfo.find(it => it.standard_v0 > 0).length;
                    const standard_v1 = subSnapshotInfo.find(it => it.standard_v1 > 0).length;
                    const standard_v2 = subSnapshotInfo.find(it => it.standard_v2 > 0).length;
                    const standard_v3 = subSnapshotInfo.find(it => it.standard_v3 > 0).length;
                    const standard_v4 = subSnapshotInfo.find(it => it.standard_v4 > 0).length;
                    if (standard_v0 >= 3) {
                        grade = "v1";
                    }
                    if (standard_v1 >= 3) {
                        grade = "v2";
                    }

                    if (standard_v2 >= 3) {
                        grade = "v3";
                    }

                    if (standard_v3 >= 3) {
                        grade = "v4";
                    }

                    if (standard_v4 >= 3) {
                        grade = "v5";
                    }
                    const opts = [ grade, 1, 1, standard_v0, standard_v1, standard_v2, standard_v3, standard_v4, 1, referrer ];
                    optsMap.set(referrer, opts);
                }
                // 如果推荐人数大于 100，升级为达标用户
                if (snapshotInfo.effective_member + 1 === 100) {
                    grade = "v0"
                    v0 = 1;
                }
            }

            const opts = [ grade, 1, 1, v0, 0, 0, 0, 0, 1, referrer ];
            optsMap.set(referrer, opts);
        }

        // 新增数据
        const updateSnapshotSql = `
            UPDATE snapshot SET account_grade = $1, 
                    invite_count_week = invite_count_week + $2, 
                    invite_member_count = invite_member_count + $3, 
                    standard_v0 = $4, 
                    standard_v1 = $5, 
                    standard_v2 = $6, 
                    standard_v3 = $7, 
                    standard_v4 = $8,
                    effective_member = effective_member + $9
                WHERE account_name = $10
        `
        for (const [ key, val ] of optsMap) {
            sqlList.push({ sql: updateSnapshotSql, values: val });
        }

        // logger.debug("sqlList: ", sqlList);
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