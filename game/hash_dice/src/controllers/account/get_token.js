// @ts-check
const logger = require("../../common/logger").child({ [ `@${ __filename }` ]: "get user token" });
const jwt = require("jsonwebtoken");
const { get_status, inspect_req_data } = require("../../common/index.js");
const { JWT_SECRET } = require("../../common/constant/eosConstants.js");

async function login(req, res, next) {
    try {
        // todo: 频率限制
        let req_data = req.body;
        logger.debug(`request data: ${JSON.stringify(req_data)}`);

        const accountName = req_data.account_name;
        if (!accountName) {
            logger.debug("account name empty");
            return res.send(get_status(2004, "request account name empty"));
        }

        //生成 token , 并返回给前端
        const token = jwt.sign({ "account_name": accountName }, JWT_SECRET, { expiresIn: '24h' });
        logger.debug("user login, token: %s", token);
        res.send(get_status(1, token));
    } catch (err) {
        logger.error(err, "record information of login failed");
        next(err);
    }
}

module.exports = login;