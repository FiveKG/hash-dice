// @ts-check
const logger = require("../common/logger").child({ [__filename]: "get banker" });
const {getCurrencyBalance} = require("./getTrxAction")
const {UE_TOKEN,UE_TOKEN_SYMBOL} =  require("../common/constant/eosConstants")

/**
 * 
 * @param {string} account 
 */
async function getBalance(account){
    try {
        let banker =  await getCurrencyBalance(UE_TOKEN,account,UE_TOKEN_SYMBOL)
        return banker
    } catch (err) {
        logger.error("getBalance error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getBalance;