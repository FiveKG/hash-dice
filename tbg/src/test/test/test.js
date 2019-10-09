// @ts-check
const sleep = require("../../job/sleep.js");
const { redis } = require("../../common");
const { pool } = require("../../db");

;(async () => {
    const accountName = "ih.1n13llsmd"
    const refList = [ 'gametestuser', 'yujinsheng11' ]
    const snapshotListInfo = [
        { "account_name": "fjvjwqa3trd4", "account_grade": "v", "effective_member": 2, "referrer_name": "gametestuser" },
        { "account_name": 'fliu41jpferv', "account_grade": 'v0', "effective_member": 3, "referrer_name": "yujinsheng11" },
        { "account_name": "ez3ypqhnj.dr", "account_grade": "v0", "effective_member": 4, "referrer_name": "nqs1gncnctll" },
        { "account_name": "sohbuxjurlce", "account_grade": "v0", "effective_member": 5, "referrer_name": "yujinsheng11" },
        { "account_name": 'rmhllyn51gs3', "account_grade": 'v0', "effective_member": 6, "referrer_name": "yujinsheng11" },
        { "account_name": 'cjrpeqofemdz', "account_grade": 'v1', "effective_member": 7, "referrer_name": "gametestuser" },
        { "account_name": 'nqs1gncnctll', "account_grade": 'v1', "effective_member": 9, "referrer_name": "gametestuser" },
        { "account_name": 'ih.1n13llsmd', "account_grade": 'v0', "effective_member": 32, "referrer_name": "yujinsheng11" },
        { "account_name": 'yujinsheng11', "account_grade": 'v0', "effective_member": 45, "referrer_name": "gametestuser" },
        { "account_name": 'gametestuser', "account_grade": 'v', "effective_member": 61, "referrer_name": "" }
    ]

    const memberCount = 3;
    const standardCount = 3;
    let sqlList = [];
    const tmp = JSON.parse(JSON.stringify(refList));
    tmp.pop();
    console.debug("tmp: ", tmp, "refList: ", refList);
    // 新增数据
    // const updateSnapshotSql = `UPDATE snapshot SET account_grade = $1 WHERE account_name = $2`;
    // todo 此处应该从自下往上层递归的修改等级
    // 第一次遍历修改 account_grade 的值
    // 主要是针对底层到顶层都刚好符合要求，向上升级的情况
    // await iterUserGrade(refList, snapshotListInfo, memberCount, standardCount, sqlList, updateSnapshotSql);
    // console.debug("sqlList: ", sqlList, refList);
})();

/**
 * 迭代用户的等级
 * @param {string[]} refList
 * @param {any[]} snapshotListInfo
 * @param {number} memberCount
 * @param {number} standardCount
 * @param {string} updateSnapshotSql
 * @param {any[] | { sql: string; values: string[]; }[]} sqlList
 */
async function iterUserGrade(refList, snapshotListInfo, memberCount, standardCount, sqlList, updateSnapshotSql) {
    const referrerAccount = refList.pop();
    if (!!referrerAccount) {
        // 推荐人的快照
        const refSnapshotInfo = snapshotListInfo.find(it => it.account_name === referrerAccount);
        let grade = "v";
        if (refSnapshotInfo.effective_member >= memberCount) {
            grade = 'v0';
            // 下级直推用户的快照
            const subSnapshotList = snapshotListInfo.filter(it => it.referrer_name === referrerAccount);
            // console.debug("snapshotListInfo: ", snapshotListInfo);
            let standard_v0 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3" || it.account_grade ===  "v2" || it.account_grade ===  "v1" || it.account_grade ===  "v0").length;
            let standard_v1 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3" || it.account_grade ===  "v2" || it.account_grade ===  "v1").length;
            let standard_v2 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3" || it.account_grade ===  "v2").length;
            let standard_v3 = subSnapshotList.filter(it => it.account_grade ===  "v4" || it.account_grade ===  "v3").length;
            let standard_v4 = subSnapshotList.filter(it => it.account_grade ===  "v4").length;
            if (standard_v0 >= standardCount) { grade = "v1"; }
            if (standard_v1 >= standardCount) { grade = "v2"; }
            if (standard_v2 >= standardCount) { grade = "v3"; }
            if (standard_v3 >= standardCount) { grade = "v4"; }
            if (standard_v4 >= standardCount) { grade = "v5"; }
            // 如果用户没有升级，那么数据库也不需要更新
            if (refSnapshotInfo.account_grade !== grade) {
                refSnapshotInfo.account_grade = grade;
                const opts = [ grade, referrerAccount ];
                sqlList.push({ sql: updateSnapshotSql, values: opts });
                // 所有的推荐人都迭代完了
                if (refList.length !== 0) {
                    iterUserGrade(refList, snapshotListInfo, memberCount, standardCount, sqlList, updateSnapshotSql)   
                }
            }
        }
    }
}