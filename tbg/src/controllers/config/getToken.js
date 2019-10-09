// @ts-check
const logger = require("../../common/logger").child({ [ `@${ __filename }` ]: "get user token" });
const jwt = require("jsonwebtoken");
const { get_status, inspect_req_data } = require("../../common/index.js");
const { JWT_SECRET } = require("../../common/constant/eosConstants.js");

async function login(req, res, next) {
    try {
        // todo: 频率限制
        let req_data = await inspect_req_data(req);
        logger.debug(`request data: ${JSON.stringify(req_data)}`);

        const key = req_data.key;
        if (!key) {
            logger.debug("request key is empty");
            return res.send(get_status(1024, "request key is empty"));
        }
        
        if (key.length !== 128) {
            logger.debug("invalid key");
            return res.send(get_status(1025, "invalid key"));
        }
        //生成 token , 并返回给前端
        const token = jwt.sign({ "key": key }, JWT_SECRET, { expiresIn: '6h' });
        logger.debug("get token: %s", token);
        res.send(get_status(1, token));
    } catch (err) {
        logger.error(err, "get token error: ", err);
        next(err);
    }
}

module.exports = login;