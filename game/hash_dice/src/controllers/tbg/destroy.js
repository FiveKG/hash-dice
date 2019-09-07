// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/destroy.js": "TBG 概况" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { AIRDROP } = require("../../common/constant/tbgAllocateRate");
const { TBG_TOKEN_SYMBOL, TBG_TOKEN } = require("../../common/constant/eosConstants");
const { getCurrencyStats } = require("../../job/getTrxAction.js");
const { getAllBalanceLog } = require("../../models/balanceLog");
const { Decimal } = require("decimal.js");

// TBG 销毁数量
async function destroy(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        // 先获取 TBG 发行总量
        const { [TBG_TOKEN_SYMBOL]: { max_supply, supply } } = await getCurrencyStats(TBG_TOKEN, TBG_TOKEN_SYMBOL);
        // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
        const maxSupply = new Decimal(max_supply.split(" ")[0]);
        const supplyAmount = new Decimal(supply.split(" ")[0]);
        const destroyAmount = maxSupply.minus(supplyAmount);
        let resData = get_status(1);
        resData["data"] = {
            "destroy_amount": destroyAmount.toFixed(8),
            "surplus_amount": supplyAmount.toFixed(8)
        }
        res.send(resData);
    } catch (err) {
        logger.error("request destroy error, the error stock is %O", err);
        throw err;
    }
}

module.exports = destroy;