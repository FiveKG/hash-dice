// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account_balance_log/search" });
const { get_status } = require("../../common");
const { account_balance_log: accountBalanceLogBiz } = require('@fjhb/db-op');

module.exports = async function (req, res, next) {
  try {
    const accountName = req.account_name;
    const reqData = req.query;

    logger.debug(`获取用户余额变动日志列表, reqData: ${JSON.stringify(reqData)}, accountName: ${accountName}`);

    let page = Number(reqData.page) >> 0;
    let limit = Number(reqData.limit) >> 0;
    if (page <= 0) page = 1;
    if (limit <= 0) limit = 20;
    
    reqData.account_name = accountName;

    const accountBalanceLogList = await accountBalanceLogBiz.search(reqData);

    let respData = get_status(1);
    respData["page_info"] = {
      page: reqData.page,
      limit: reqData.limit
    };
    respData["data"] = accountBalanceLogList;

    res.send(respData);
  } catch (err) {
    logger.error(err, `获取用户余额变动日志列表 时, 报错了`);
    next(err);
  }
}
