// @ts-check
const userWithdraw = require("./src/db/psUserWithdraw.js");
const handlerWithdraw = require("./src/job/handlerWithdraw.js");

userWithdraw.sub(async msg => {
    try {
        await handlerWithdraw(msg.account_name, msg.symbol, msg.amount);
    } catch (err) {
        throw err;
    }
});