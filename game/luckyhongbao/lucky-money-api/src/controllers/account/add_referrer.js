// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/add_referrer" });
const eosAccountBiz = require("@fjhb/db-op").eos_account;
const accountReferBiz = require("@fjhb/db-op").account_refer;
const { get_status } = require("../../common");

// 添加用户推荐人
async function addAccountRefer(req, res, next) {
    try {
        const req_data = req.body;
        logger.debug(`添加账号推荐关系. request data: %j`, req_data);

        const accountName = req_data.account_name;
        const referName = req_data.refer_name;

        if (typeof accountName !== "string" || typeof referName !== "string" || !accountName || !referName) {
            logger.info(`参数不合法, account_name: ${accountName}, refer_name: ${referName}, ip: ${req.ip}`);

            res.send(get_status("参数不合法"));
            return;
        } else if (accountName === referName) {
            logger.info(`不能与自己建立推荐关系, account_name: ${accountName}, refer_name: ${referName}, ip: ${req.ip}`);

            res.send(get_status("不能与自己建立推荐关系"));
            return;
        }

        const eos_account = await eosAccountBiz.get_by_account_name(accountName);

        if (eos_account == null) {
            logger.warn(`账号不存在, account_name: ${accountName}, ip: ${req.ip}`);

            res.send(get_status("找不到 eos 账户"));
            return;
        }

        const agentAccountInfo = await eosAccountBiz.get_by_account_name(referName);
        if (agentAccountInfo == null) {
            logger.warn(`推荐人账号不存在, refer_name: ${referName}, ip: ${req.ip}`);

            res.send(get_status("推荐人账号不存在"));
            return;
        }

        const referrer = await accountReferBiz.get_by_account_name(accountName);
        if (referrer) {
            logger.info(`已建立推荐关系, 推荐人是 ${referrer.refer_name}`);

            res.send(get_status("已建立推荐关系", referrer.refer_name));
            return;
        }
        // A 有 B, C 两个下级 |  但 A 拿 C 作为它的上级  | 所以 只需要检查 C 作为下级 的 上级是否为 A 
        const agentReferInfo = await accountReferBiz.get_by_account_name(referName);
        if (agentReferInfo && agentReferInfo.refer_name === accountName) {
            logger.info(`不能使用该账号下的被推荐人作为推荐人建立关系, agentReferInfo.refer_name: ${agentReferInfo.refer_name}, accountName: ${accountName}`);

            res.send(get_status("不能使用该账号下的被推荐人作为推荐人建立关系"));
            return;
        }

        await accountReferBiz.create({
            "account_name": accountName,
            "refer_name": referName
        });

        res.send(get_status(1, true));
    } catch (error) {
        logger.error(error, "设置推荐关系时报错了");
        next(error);
    }
};

module.exports = addAccountRefer;
