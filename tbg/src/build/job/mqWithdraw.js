// @ts-check
const userWithdraw = require("../../db/psUserWithdraw.js");
const handlerWithdraw = require("../../job/handlerWithdraw.js");

userWithdraw.sub(async msg => {
    try {
        log(msg);
        let result = JSON.parse(msg);
        await handlerWithdraw(result.account_name, result.symbol, result.amount);
    } catch (err) {
        throw err;
    }
});