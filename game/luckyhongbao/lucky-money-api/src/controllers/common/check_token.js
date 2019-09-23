// @ts-check
const jwt = require("jsonwebtoken");
const logger = require("@fjhb/logger");
const { get_config, get_status } = require("../../common");
const jwt_secret = get_config("jwt_secret");

module.exports = async function (req, res, next) {
    let token = req.headers["token"] || req.query["token"];
    
    if (!token) {
        return res.send(get_status(700));
    }

    jwt.verify(token, jwt_secret, (err, decoded) => {
        if (err) {
            logger.warn(`check token error, reason: ${err.message}`);
            return res.send(get_status(700));
        }
        logger.debug(`step1`);
        if (!decoded.account_name) {
            logger.debug(`step2`);
            logger.warn("json format is invalid");
            return res.send(get_status(700));
        }
        logger.debug(`step3`);
        req["account_name"] = decoded.account_name;
        next();
    });
}