// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "TBG 概况" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { pool } = require("../../db/index.js");

// 创建系统公告
async function notification(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const insertSql = `
            INSERT INTO system_notification(creator, title, description, create_time)
                VALUES($1, $2, $3, $4)    
        `
        const { rows } = await pool.query(insertSql, [ reqData.creator, reqData.title, reqData.description, "now()" ]);
        res.send(get_status(1));
    } catch (err) {
        logger.error("request add notification error, the error stock is %O", err);
        throw err;
    }
}

module.exports = notification;