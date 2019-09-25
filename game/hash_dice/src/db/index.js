// @ts-check
module.exports = {
    "pool"           : require("./pools.js"),
    "createTable"    : require("./createTable.js"),
    "amqp"           : require("./amqp.js"),
    "psUserWithdraw" : require("./psUserWithdraw.js"),
    "psGame"         : require("./psGame.js"),
    "psTrx"          : require("./psTrx"),
    "psBet"          : require("./psBet"),
    "psModifyBalance": require("./psModifyBalance"),
    "psHashDiceOpen" : require("./psHashDiceOpen")
}