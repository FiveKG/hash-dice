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
    // const arr = [ 1, 2, 3, 4, 5 ]
    // // console.debug(...arr);
    // const now = new Date().getHours()
    // const arr = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]

    // for (const i in arr) {
    //     await sleep(5000);
    //     console.debug(i)
    //     getInfo(...arr);
    // }

    const selectGameAmount = `
            SELECT sum(change_amount) 
                FROM balance_log 
                WHERE extract(month FROM create_time) = 9
                AND account_name = $1
                AND op_type = $2
        `;
    const { rows: [ { sum } ] } = await pool.query(selectGameAmount, [ 'yujinsheng11', 'buy' ]);
    console.debug("sum: ", sum);
    const sql = `
        SELECT * FROM balance_log WHERE op_type = $1 AND create_time BETWEEN CAST($2 AS DATE) - 1 AND $2
    `
    const now = new Date(2019, 7, 30, 0, 0);
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