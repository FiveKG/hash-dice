// @ts-check
const sleep = require("../../job/sleep.js");
const { getSafeAccountList } = require("../../models/systemPool");
const { getBalanceLogByTerm } = require("../../models/balanceLog");
const { redis } = require("../../common");
const { pool } = require("../../db");

/**
 * 
 * @param { number } a 
 * @param { number } b 
 * @param { number } c 
 * @param { number } d 
 * @param { number } e 
 */
function getInfo(a, b, c, d, e) {
    console.debug(a, b, c, d, e);
}


;(async () => {
    const accountName = "z134invguxz5";
    const referrerAccountList = [ "", "gametestuser", "yujinsheng11", "ih.1n13llsmd", "nqs1gncnctll", "cjrpeqofemdz", "rmhllyn51gs3", "fliu41jpferv", "z134invguxz5" ]
    const refList = []
    for (const ref of referrerAccountList) {
        if (ref === '' || ref === accountName) {
            continue;
        }
        refList.push(ref);
    }

    const refJoinSnapSql = `
        SELECT s.account_name, s.invite_count_week, s.invite_member_count, s.standard_v0, s.standard_v1, s.standard_v2, 
                s.standard_v3, s.standard_v4, s.effective_member, r.referrer_name 
            FROM snapshot s JOIN referrer r ON r.account_name = s.account_name;
    `
    const { rows: snapshotListInfo } = await pool.query(refJoinSnapSql);
    const optsMap = new Map();
    for (const acc of refList) {
        let v0 = 0;
        let grade = "v"
        const snapshotInfo = snapshotListInfo.find(it => it.account_name === acc);
        // 用户推荐人数大于 100 时，伞下有可能有达标用户
        if (snapshotInfo.effective_member > 100) {
            // 下级直推用户的快照
            const subSnapshotList = snapshotListInfo.filter(it => it.referrer_name === acc);
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
            const opts = [ grade, 1, 1, standard_v0, standard_v1, standard_v2, standard_v3, standard_v4, 1, acc ];
            optsMap.set(acc, opts);
        } else {
            // 如果推荐人数大于 100，升级为达标用户
            if (snapshotInfo.effective_member + 1 === 100) {
                grade = "v0"
                v0 = 1;
            }

            const opts = [ grade, 1, 1, v0, 0, 0, 0, 0, 1, acc ];
            optsMap.set(acc, opts);
        }
    }
    // console.debug("refList: ", refList);
    console.debug("snapshotListInfo: ", snapshotListInfo);
    // const arr = [ 1, 2, 3, 4, 5 ]
    // // console.debug(...arr);
    // const now = new Date().getHours()
    // const arr = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]

    // for (const i in arr) {
    //     await sleep(5000);
    //     console.debug(i)
    //     getInfo(...arr);
    // }

    // const selectGameAmount = `
    //         SELECT sum(change_amount) 
    //             FROM balance_log 
    //             WHERE extract(month FROM create_time) = 9
    //             AND account_name = $1
    //             AND op_type = $2
    //     `;
    // const { rows: [ { sum } ] } = await pool.query(selectGameAmount, [ 'yujinsheng11', 'buy' ]);
    // console.debug("sum: ", sum);
    // const sql = `
    //     SELECT * FROM balance_log WHERE op_type = $1 AND create_time BETWEEN CAST($2 AS DATE) - 1 AND $2
    // `
    // const now = new Date(2019, 7, 30, 0, 0);
    // const { rows: checkInList } = await pool.query(sql, [ 'check_in', now ]);

    // console.debug("checkInList: ", now, checkInList);

    const str = "cb1528298aa9c3a6d4d047e14701c06f1fdc3b9982ab5dead0a3336e13d07064";
    const reg = /[\d]+/
    const res = reg.test(str);

    // const balanceLog = await getBalanceLogByTerm({ opType: "sort", "symbol": "UE"});
    // console.debug(balanceLog)

    // let safeAccountList = await getSafeAccountList();
    // for (const info of safeAccountList) {
    //     console.debug("info: ", info);
    //     const acc = await redis.hget(`tbg:income:${info.account_name}`, "sort");
    //     if (!!acc) {
    //         const res = JSON.parse(acc).map(it => it.change_amount).reduce((pre, curr) => Number(pre) + Number(curr));
    //         console.debug("res: ", res);
    //     }
    // }

    // while(arr.length > 0) {
    //     arr.splice(0,2)
    //     console.debug(arr.length)
    // }
})();