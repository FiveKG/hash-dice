// @ts-check

const sleep = require("../../job/sleep.js");

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
    const arr = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]

    for (const i in arr) {
        await sleep(5000);
        console.debug(i)
        getInfo(...arr);
    }

    // while(arr.length > 0) {
    //     arr.splice(0,2)
    //     console.debug(arr.length)
    // }
})();