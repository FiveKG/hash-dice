// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/balance/getGameBalance.js": "获取用户游戏额度" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { pool } = require("../../db");
const { getUserBalance } = require("../../models/balance");
const { WITHDRAW_ENABLE } = require("../../common/constant/balanceConstants");
const { Decimal } = require("decimal.js");

// 获取用户游戏额度
async function getGameBalance(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const sql = `
            SELECT tb.release_amount, tb.sell_amount, tb.active_amount, b.withdraw_enable, b.repeat_currency, b.lotto_currency, b.game_currency
                FROM balance b
                JOIN tbg_balance tb ON tb.account_name = b.account_name
                WHERE tb.account_name = any($1)
        `
        let resData = get_status(1);
        const { rows: balanceInfo } = await pool.query(sql, [ reqData.account_name.split(",") ]);
        if (!balanceInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        resData["data"] = balanceInfo
        res.send(resData);
    } catch (err) {
        logger.error("request getGameBalance error, the error stock is %O", err);
        throw err
    }
}

module.exports = getGameBalance;