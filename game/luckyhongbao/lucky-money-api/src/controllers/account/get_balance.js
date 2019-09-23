// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/get_balance" });
const { eos_account: eosAccountBiz, db } = require("@fjhb/db-op");
const { get_status } = require("../../common");

async function get_balance(req, res, next) {
    try {
        const accountName = req.account_name;
        console.debug(`获取用户 ${accountName} 余额`    );

        // const result = await db.sequelize.query(`select * from eos_account where account_name = '${ accountName }'`);
        // console.debug("result: ", result);
        const eosAccountInfo = await eosAccountBiz.get_by_account_name(accountName);
        if (eosAccountInfo == null) {
            logger.info(`账号不存在, account_name: ${accountName} . ip: ${req.ip}`);

            return res.send(get_status("找不到 eos 账户"));
        }

        res.send(get_status(1, { balance: eosAccountInfo.balance }));
    } catch (error) {
        logger.error(error, "find eos_account error");
        next(error);
    }
};

module.exports = get_balance;