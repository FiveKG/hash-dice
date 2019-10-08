// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "生成记录快照信息" });

/**
 * 生成记录快照信息
 * @param { string } accountName 
 * @param { string[] } referrerAccountList
 */
async function genSnapshot(accountName, referrerAccountList) {
    try {
        const memberCount = 100;
        const standardCount = 3;
        const refList = []
        for (const ref of referrerAccountList) {
            if (ref === '' || ref === accountName) {
                continue;
            }
            refList.push(ref);
        }

        // 先更新推荐的人数, 向上回朔，增加上级的相应人数
        const updateEffectiveMemberSql = `
            UPDATE snapshot SET 
                effective_member = effective_member + 1, 
                invite_count_week = invite_count_week + 1, 
                invite_member_count = invite_member_count + 1, 
                account_grade = (CASE effective_member + 1 >= $1 WHEN true THEN 'v0' WHEN false THEN 'v' ELSE account_grade END)
                WHERE account_name = any($2)
        `
        await pool.query(updateEffectiveMemberSql, [ memberCount, refList ]);
        logger.debug("refList: ", refList);
        logger.debug("update effective_member success");
        const sqlList = [];
        const refJoinSnapSql = `
            SELECT s.account_name, s.account_grade, s.invite_count_week, s.invite_member_count, s.effective_member, r.referrer_name 
                FROM snapshot s JOIN referrer r ON r.account_name = s.account_name;
        `
        const { rows: snapshotListInfo } = await pool.query(refJoinSnapSql);
        // logger.debug("snapshotListInfo: ", snapshotListInfo);
        // 新增数据
        const updateSnapshotSql = `UPDATE snapshot SET account_grade = $1 WHERE account_name = $2`
        for (const referrer of refList) {
            let grade = "v"
            const snapshotInfo = snapshotListInfo.find(it => it.account_name === referrer);
            logger.debug("snapshotInfo: ", snapshotInfo);
            // 用户推荐人数大于 100 时，伞下有可能有达标用户
            if (snapshotInfo.effective_member >= memberCount) {
                grade = 'v0';
                // 下级直推用户的快照
                const subSnapshotList = snapshotListInfo.filter(it => it.referrer_name === referrer);
                // logger.debug("snapshotListInfo: ", snapshotListInfo);
                logger.debug("subSnapshotList.filter(it => it.standard_v0 > 0): ", subSnapshotList.filter(it => it.account_grade ===  "v0"));
                let standard_v0 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3" || it.account_grade ===  "v2" || it.account_grade ===  "v1" || it.account_grade ===  "v0").length;
                let standard_v1 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3" || it.account_grade ===  "v2" || it.account_grade ===  "v1").length;
                let standard_v2 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3" || it.account_grade ===  "v2").length;
                let standard_v3 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3").length;
                let standard_v4 = subSnapshotList.filter(it => it.account_grade ===  "v4").length;
                if (standard_v0 >= standardCount) {
                    grade = "v1";
                }
                if (standard_v1 >= standardCount) {
                    grade = "v2";
                }

                if (standard_v2 >= standardCount) {
                    grade = "v3";
                }

                if (standard_v3 >= standardCount) {
                    grade = "v4";
                }

                if (standard_v4 >= standardCount) {
                    grade = "v5";
                }
            } 

            const opts = [ grade, referrer ];
            sqlList.push({ sql: updateSnapshotSql, values: opts });
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