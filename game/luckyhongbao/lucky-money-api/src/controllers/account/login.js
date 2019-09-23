// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/login" });
const jwt = require("jsonwebtoken");
const { eos_account, account_log } = require("@fjhb/db-op");
const { get_status, get_config } = require("../../common");
const jwt_secret = get_config("jwt_secret");

async function login(req, res, next) {
    try {
        // todo: 频率限制

        let req_data = req.body;
        logger.debug(`account login. request data: ${JSON.stringify(req_data)}`);

        const accountName = req_data.account_name;
        if (!accountName) {
            logger.debug("account name empty");
            return res.send(get_status(2004, "request account name empty"));
        }
        //获取用户信息
        const account = await eos_account.get_by_account_name(accountName);
        if (account == null) {
            //用户不存在, 那么添加账号信息
            logger.debug("eos_account is not exists , add eos_account");
            await eos_account.create({ "account_name": accountName });
        }

        // 记录登录信息
        await account_log.create({ "account_name": accountName, "ip_address": req.ip, "op_type": "login" });

        //生成 token , 并返回给前端
        const token = jwt.sign({ "account_name": accountName }, jwt_secret, { expiresIn: '24h' });
        logger.debug("user login, token: %s", token);
        res.send(get_status(1, token));
    } catch (err) {
        logger.error(err, "record information of login failed");
        next(err);
    }
}

module.exports = login;