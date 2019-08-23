// @ts-check

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
    // getInfo(...arr);
    const arr = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
    while(arr.length > 0) {
        arr.splice(0,2)
        console.debug(arr.length)
    }
})();