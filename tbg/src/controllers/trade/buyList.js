// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "买入交易列表" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getTradeInfoHistory } = require("../../models/trade");
const { pool } = require("../../db");
const { Decimal } = require("decimal.js");

// 买入交易列表
async function buyList(req, res, next) {
    try {      
        const reqDate = await inspect_req_data(req);
        let tmpStr = ``
        // 根据挂单时间进行筛选
        if (!!reqDate.order_time) {
            tmpStr = `current_timestamp - create_time > interval '5 hours'`;
        } else {
            tmpStr = `current_timestamp - create_time < interval '5 hours'`;
        }
        const sql = `SELECT * 
                        FROM trade 
                        WHERE trade_type != 'sell'
                        AND state = 'wait'
                        AND ${ tmpStr }
                        ORDER BY create_time DESC`;
        logger.debug(sql);
        const { rows } = await pool.query(sql);
        // const tradeInfo = await getTradeInfoHistory({ "tradeType": "buy", state: "create", orderBy: "ASC" });
        let resData = get_status(1);
        resData["data"] = rows.map(it => {
            return {
                "create_time": it.create_time,
                "price": it.price,
                "amount": new Decimal(it.amount).toNumber(),
                "transaction": new Decimal(it.trx_amount).toNumber()
            }
        })
        res.send(resData);
    } catch (err) {
        logger.error("request buyList error, the error stock is %O", err);
        throw err
    }
}

module.exports = buyList;