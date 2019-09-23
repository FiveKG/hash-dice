// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/check_relation" });
const { get_status } = require("../../common");
const { account_refer } = require("@fjhb/db-op");

module.exports = async function (req, res, next) {
  try {
    const accountName = req.query.account_name;
    logger.debug(`检查是否已建立推荐关系, account_name: ${accountName}`);

    if (typeof accountName !== "string" || !accountName) {
      logger.info(`参数不合法, account_name: ${accountName}, ip: ${req.ip}`);

      res.send(get_status("参数不合法"));
      return;
    }

    const referRelation = await account_refer.get_by_account_name(accountName);

    if (referRelation) {
      res.send(get_status(1, { refer_name: referRelation.refer_name }));
    } else {
      res.send(get_status(1, { refer_name: "" }));
    }
    
  } catch (err) {
    logger.error(err, "检查是否已建立推荐关系时报错了");
    next(err);
  }
}
