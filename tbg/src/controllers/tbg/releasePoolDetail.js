// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/releasePoolDetail.js": "线性释放池明细" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { TBG_TOKEN_SYMBOL } = require("../../common/constant/eosConstants");

// 线性释放池明细
async function releasePoolDetail(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, "symbol": TBG_TOKEN_SYMBOL });

        const typeList = [ 
            OPT_CONSTANTS.FIRST_BUY, OPT_CONSTANTS.GAME, OPT_CONSTANTS.MINING_REFERRER, OPT_CONSTANTS.MINING,
            OPT_CONSTANTS.TBG_1, OPT_CONSTANTS.CHECK_IN, OPT_CONSTANTS.BUY, OPT_CONSTANTS.SELL, OPT_CONSTANTS.RELEASE,
            OPT_CONSTANTS.BIND, OPT_CONSTANTS.DESTROY
        ];
        let resData = get_status(1);
        resData["data"] = {
            "detail": balanceLogInfo.filter(it  => {
                if (typeList.includes(it.op_type)) {
                    return {
                        "create_time": it.create_time,
                        "release_type": it.op_type,
                        "amount": it.change_amount,
                        "balance": it.current_balance
                    }
                }
            })
        }
        res.send(resData);
    } catch (err) {
        logger.error("request releasePoolDetail error, the error stock is %O", err);
        throw err;
    }
}

module.exports = releasePoolDetail;