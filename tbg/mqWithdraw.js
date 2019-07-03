// @ts-check
const userWithdraw = require("./src/db/psUserWithdraw.js");
const handlerWithdraw = require("./src/job/handlerWithdraw.js");

userWithdraw.sub(async msg => {
    try {
        console.log(msg);
        let result = JSON.parse(msg);
        await handlerWithdraw(result.account_name, result.symbol, result.amount);
    } catch (err) {
        throw err;
    }
});