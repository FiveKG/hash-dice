// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/notification.js": "TBG 概况" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { AIRDROP } = require("../../common/constant/tbgAllocateRate");
const { notification: system_notification } = require("../../common/constant/notification");
const { getCurrencyStats } = require("../../job/getTrxAction.js");
const { getAllBalanceLog } = require("../../models/balanceLog");
const { Decimal } = require("decimal.js");

// TBG 概况
async function notification(req, res, next) {
    try {
        let resData = get_status(1);
        resData["data"] = {
            system_notification: system_notification
        }

        res.send(resData);
    } catch (err) {
        logger.error("request notification error, the error stock is %O", err);
        throw err;
    }
}

module.exports = notification;