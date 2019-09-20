// @ts-check
const sleep = require("../../job/sleep.js");
const { redis, xhr, generate_primary_key } = require("../../common");
const { pool } = require("../../db");
const url = require("url");
const { scheduleJob } = require("node-schedule");
let count = 1;
const { getLatestGameSession, getGameInfo } = require("../../models/game");
const df = require("date-fns");
const { Decimal } = require("decimal.js");

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
    const { rows: gsId } = await pool.query(`SELECT gs_id FROM game_session LIMIT 5`);
    const now = new Date();
    const diff = df.differenceInSeconds(sessionInfo.end_time, now);
    console.debug("now: ", now);
    console.debug("sessionInfo.end_time: ", sessionInfo.end_time);
    console.debug("diff: ", diff);

    const sqlList = []
    const insertBetOrder = `
        INSERT INTO bet_order(bo_id, gs_id, extra, account_name, create_time, bet_num, key_count, amount)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `

    const trxIds = [ 
        "1f5e66ab68e9dd0a7698ae75613ac573ae80a60ca85a229f433fa0e7a8b8b394", "f1dcd3a686e9655843f75d8a94f3053286d65b610b8bd498d506ca305210b3d3",
        "e938b26e5ba76877b689d47fa7c845ec32e82737210086db1497cf76a8c37fa6", "038cb75e3148e0e1b36aaae3dbb079b7a5a16d48632df8bee80089412fa569ef",
        "37bde83a379b37b94cf4a4696c0001a9c2ff5d84de83a8d20268705290a32e3e"
    ]

    for (let i = 0; i < gsId.length; i++) {
        const id = gsId[i].gs_id;
        let extra = { agent_account: "globallotto", transaction_id: trxIds[i], pay_type: "game_currency" }
        if (i === 1) {
            extra.agent_account = "dengderong";
            extra.pay_type = "UE";
        }

        const tmp = [];
        // 每个 key 生成一组号码
        const betKey = Math.ceil((Math.random() * 5))
        for (let i = 0; i < betKey; i++) {
            tmp.push(Math.ceil(Math.random() * 899999999 + 100000000).toString().split("").join(","));
        }
        const betNum = tmp.join("|");
        const betAmount = new Decimal(0.1).mul(betKey).toNumber();
        sqlList.push({
            sql: insertBetOrder,
            values: [ generate_primary_key(), id, extra, "dengderong", "now()", betNum, betKey, betAmount ]
        });
    }
    
    const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await Promise.all(sqlList.map(it => {
                client.query(it.sql, it.values)
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

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