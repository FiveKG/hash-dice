// @ts-check
const { psBind } = require("../../db");

(async () => {
    const data = {
        "a": "a",
        "b": [ 1, 2 , 3, 4 ]
    }
    await psBind.sub(msg => {
        console.debug("msg: ", msg);
    });
})()