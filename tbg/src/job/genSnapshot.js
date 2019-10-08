// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "生成记录快照信息" });
const df = require("date-fns");

/**
 * 生成记录快照信息
 * @param { string } accountName 
 * @param { string[] } referrerAccountList
 */
async function genSnapshot(accountName, referrerAccountList) {
    try {
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
                account_grade = (CASE effective_member + 1 >= 100 WHEN 'v0' THEN 'v' END)
                WHERE account_name = any($1)
        `
        await pool.query(updateEffectiveMemberSql, [ refList ]);
        logger.debug("update effective_member success");
        const sqlList = [];
        const refJoinSnapSql = `
            SELECT s.account_name, s.invite_count_week, s.invite_member_count, s.standard_v0, s.standard_v1, s.standard_v2, 
                    s.standard_v3, s.standard_v4, s.effective_member, r.referrer_name 
                FROM snapshot s JOIN referrer r ON r.account_name = s.account_name;
        `
        const { rows: snapshotListInfo } = await pool.query(refJoinSnapSql);
        const optsMap = new Map();
        let grade = "v"
        for (const referrer of refList) {
            const snapshotInfo = snapshotListInfo.find(it => it.account_name === referrer);
            // 用户推荐人数大于 100 时，伞下有可能有达标用户
            if (snapshotInfo.effective_member > 100) {
                // 下级直推用户的快照
                const subSnapshotList = snapshotListInfo.filter(it => it.referrer_name === referrer);
                const standard_v0 = subSnapshotList.filter(it => it.standard_v0 > 0).length;
                const standard_v1 = subSnapshotList.filter(it => it.standard_v1 > 0).length;
                const standard_v2 = subSnapshotList.filter(it => it.standard_v2 > 0).length;
                const standard_v3 = subSnapshotList.filter(it => it.standard_v3 > 0).length;
                const standard_v4 = subSnapshotList.filter(it => it.standard_v4 > 0).length;
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
                const opts = [ standard_v0, standard_v1, standard_v2, standard_v3, standard_v4, grade, referrer ];
                optsMap.set(referrer, opts);
            }
        }

        // 新增数据
        const updateSnapshotSql = `
            UPDATE snapshot SET 
                standard_v0 = $1, standard_v1 = $2, standard_v2 = $3, standard_v3 = $4, standard_v4 = $5, account_grade = $6 
                WHERE account_name = $7
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