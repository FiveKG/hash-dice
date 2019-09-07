// @ts-check
const { psBind } = require("../../db");

(async () => {
    let arr = []
    const obj = {};
    const data = {
        "a": "a",
        "b": [ 1, 2 , 3, 4 ]
    }
    await psBind.pub(data);
    arr = data.b;
    console.debug(Object.values(obj).length);

    await Promise.all(arr.map(it => {
        console.debug(it);
    }))
})()