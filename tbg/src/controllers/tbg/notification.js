// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "TBG 概况" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { pool } = require("../../db/index.js");

// TBG 概况
async function notification(req, res, next) {
    try {
        let resData = get_status(1);
        const sql = `SELECT title, description, create_time FROM system_notification ORDER BY create_time DESC`
        const { rows } = await pool.query(sql);
        resData["data"] = {
            system_notification: rows
        }

        res.send(resData);
    } catch (err) {
        logger.error("request notification error, the error stock is %O", err);
        throw err;
    }
}

module.exports = notification;