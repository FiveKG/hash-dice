// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/my_reward_list" });
const { get_status } = require("../../common");
const {
  account_balance_log: accountBalanceLogBiz
} = require("@fjhb/db-op");

module.exports = async function (req, res, next) {
  try {
    const reqData = req.query;
    const accountName = req.account_name;

    logger.debug(`reqData: ${JSON.stringify(reqData)}, accountName: ${accountName}`);

    let page = Number(reqData.page) >> 0;
    let limit = Number(reqData.limit) >> 0;
    if (page <= 0) page = 1;
    if (limit <= 0) limit = 10;

    const { rows: accountRewardList, count: total } = await accountBalanceLogBiz.getAccountRewardList(accountName, { page, limit });

    let responseData = get_status(1);
    responseData["page_info"] = { page, limit, total };
    responseData["data"] = accountRewardList;

    res.send(responseData);
  } catch (err) {
    logger.error(err, "获取[我的奖金列表]时报错了");
    next(err);
  }
}
