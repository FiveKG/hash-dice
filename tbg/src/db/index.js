// @ts-check
module.exports = {
    "pool": require("./pools.js"),
    "createTable": require("./createTable.js"),
    "amqp": require("./amqp.js"),
    "psBuyAssets": require("./psBuyAssets.js"),
    "psCheckIn": require("./psCheckIn.js"),
    "psSellAssets": require("./psSellAssets.js"),
    "psUserWithdraw": require("./psUserWithdraw.js"),
    "psTbg2": require("./psTbg2.js"),
    "psBind": require("./psBind.js"),
    "psGame": require("./psGame.js"),
    "psTshIncome": require("./psTshIncome.js"),
    "psRaise": require("./psRaise.js"),
    "psTrx": require("./psTrx"),
    "psModifyBalance": require("./psModifyBalance")
}