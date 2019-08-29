// @ts-check
const sleep = require("../../job/sleep.js");
const { getSafeAccountList } = require("../../models/systemPool");
const { redis } = require("../../common");

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

    let safeAccountList = await getSafeAccountList();
    for (const info of safeAccountList) {
        console.debug("info: ", info);
        const acc = await redis.hget(`tbg:income:${info.account_name}`, "sort");
        if (!!acc) {
            const res = JSON.parse(acc).map(it => it.change_amount).reduce((pre, curr) => Number(pre) + Number(curr));
            console.debug("res: ", res);
        }
    }

    // while(arr.length > 0) {
    //     arr.splice(0,2)
    //     console.debug(arr.length)
    // }
})();