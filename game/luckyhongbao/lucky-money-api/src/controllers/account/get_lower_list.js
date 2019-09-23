// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/get_lower_list" });
const { get_status } = require("../../common");
const { account_refer } = require("@fjhb/db-op");

module.exports = async function (req, res, next) {
  try {
    const agentAccountName = req.account_name;

    logger.debug(`当前用户 account_name: [${agentAccountName}]`);

    const lowerList = await account_refer.get_all_referrer(agentAccountName);

    res.send(get_status(1, lowerList));
  } catch (err) {
    logger.error(err, `获取用户的下级用户列表时, 报错了`);
    next(err);
  }
}
