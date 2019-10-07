// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "私募交易列表" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getTradeInfoHistory } = require("../../models/trade");
const { pool } = require("../../db");
const { Decimal } = require("decimal.js");

// 私募交易列表
async function raiseList(req, res, next) {
    try {
        const reqDate = await inspect_req_data(req);
        const sql = `SELECT * 
                        FROM trade 
                        WHERE trade_type = 'raise'  
                        AND state = 'finished'
                        ORDER BY create_time DESC`;
        logger.debug(sql);
        const { rows } = await pool.query(sql)
        // const tradeInfo = await getTradeInfoHistory({ "tradeType": "sell", state: "create", orderBy: "ASC" });
        let resData = get_status(1);
        resData["data"] = rows.map(it => {
            return {
                "create_time": it.create_time,
                "price": new Decimal(it.price).toFixed(4),
                "amount": new Decimal(it.amount).toNumber(),
                "transaction": new Decimal(it.trx_amount).toNumber()
            }
        });
        res.send(resData);
    } catch (err) {
        logger.error("request raiseList error, the error stock is %O", err);
        throw err
    }
}

module.exports = raiseList;