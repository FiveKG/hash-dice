// @ts-check
const sleep = require("../../job/sleep.js");
const { redis, xhr } = require("../../common");
const { pool } = require("../../db");
const url = require("url");
const { scheduleJob } = require("node-schedule");
let count = 1;
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const df = require("date-fns");

scheduleJob("0 */1 * * * *", one);

async function one() {
    console.debug("one minute: ", new Date());
}

;(async () => {
    // const myMap = new Map();
    // const arr = [ 1, 2, 3, 4, 5 ]
    // for (const val of arr) {
    //     myMap.set(val, val + "val");
    // }

    const sessionInfo = await getLatestGameSession();
    const now = new Date();
    const diff = df.differenceInSeconds(sessionInfo.end_time, now);
    console.debug("now: ", now);
    console.debug("sessionInfo.end_time: ", sessionInfo.end_time);
    console.debug("diff: ", diff);

    // const TBG_SERVER = process.env.TBG_SERVER || "http://localhost:9527/";
    // const { data: { referrer_account } } = await xhr.get(url.resolve(TBG_SERVER, "/account/get_referrer"), { data: { account_name: "gametestuser" } });
    // console.debug("referrer_account: ", referrer_account);

    // const resp= await xhr.get(url.resolve(TBG_SERVER, "/balance/game_balance"), { data: { account_name: "yujinsheng11" } });
    // console.debug("resp: ", resp);

    // for (const [  key, val ] of myMap) {
    //     console.debug("key: ", key);
    //     console.debug("val: ", val);
    // }
    // // console.debug(...arr);
    // const now = new Date().getHours()
    // const arr = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]

    // for (const i in arr) {
    //     await sleep(5000);
    //     console.debug(i)
    //     getInfo(...arr);
    // }

    const sql = `
        SELECT * FROM balance_log WHERE op_type = $1 AND create_time BETWEEN CAST($2 AS DATE) - 1 AND $2
    `
    // const now = new Date(2019, 7, 30, 0, 0);
    // const { rows: checkInList } = await pool.query(sql, [ 'check_in', now ]);

    // console.debug("checkInList: ", now, checkInList);

    const str = "cb1528298aa9c3a6d4d047e14701c06f1fdc3b9982ab5dead0a3336e13d07064";
    const reg = /[\d]+/
    const res = reg.test(str);

    const betCode = `123456789|223456789|223456789|233456789|234456789`
    const openCode = `323456789`;
    // let safeAccountList = await getSafeAccountList();
    // for (const info of safeAccountList) {
    //     console.debug("info: ", info);
    //     const acc = await redis.hget(`tbg:income:${info.{ account_name: "yujinsheng11" }}`, "sort");
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