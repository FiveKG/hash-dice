// @ts-check
const jwt = require("jsonwebtoken");
const logger = require("../../common/logger").child({ [ `@${ __filename }` ]: "check user token" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { JWT_SECRET } = require("../../common/constant/eosConstants.js");

module.exports = async function (req, res, next) {
    let token = req.headers["token"] || req.query["token"];
    
    if (!token) {
        return res.send(get_status(700));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            logger.warn(`check token error, reason: ${err.message}`);
            return res.send(get_status(700));
        }
        logger.debug(`step1`);
        // if (!decoded.account_name) {
        //     logger.debug(`step2`);
        //     logger.warn("json format is invalid");
        //     return res.send(get_status(700));
        // }
        logger.debug(`step3`);
        // req["account_name"] = decoded.account_name;
        next();
    });
}