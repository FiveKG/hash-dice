// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/trade/tbgInfo.js": "TBG 概况" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { AIRDROP } = require("../../common/constant/tbgAllocateRate");
const { TBG_TOKEN_SYMBOL, TBG_TOKEN } = require("../../common/constant/eosConstants");
const { getCurrencyStats } = require("../../job/getTrxAction.js");
const { getAllBalanceLog } = require("../../models/balanceLog");
const { Decimal } = require("decimal.js");

// TBG 概况
async function tbgInfo(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        // 先获取 TBG 发行总量
        const { [TBG_TOKEN_SYMBOL]: { max_supply } } = await getCurrencyStats(TBG_TOKEN, TBG_TOKEN_SYMBOL);
        // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
        const maxSupply = new Decimal(max_supply.split(" ")[0]);
        // 查询空投记录
        const logInfo = await getAllBalanceLog(TBG_TOKEN_SYMBOL);
        let detail = [];
        if (logInfo.length === 0) {
            detail = AIRDROP.map(it => {
                return {
                    "airdrop_type": it.name,
                    "airdrop_amount": maxSupply.mul(it.rate).toFixed(8),
                    "airdrop_quantity": 0,
                    "airdrop_rate": 0
                } 
            })
        } else {
            detail = AIRDROP.map(it => {
                const quantity = logInfo.find(q => q.op_type === it.id);
                const amount = maxSupply.mul(it.rate);
                return {
                    "airdrop_type": it.name,
                    "airdrop_amount": amount.toFixed(8),
                    "airdrop_quantity": !!quantity ? quantity.total : 0,
                    "airdrop_rate": !!quantity ? new Decimal(quantity.total).div(amount).toFixed(2) : 0
                }
            });
        }
        let resData = get_status(1);
        resData["data"] = {
            detail: detail
        }

        res.send(resData);
    } catch (err) {
        logger.error("request tbgInfo error, the error stock is %O", err);
        throw err;
    }
}

module.exports = tbgInfo;