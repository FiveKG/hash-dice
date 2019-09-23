// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/withdraw" });
const { get_status, get_config } = require("../../common");
const { eos_account } = require("@fjhb/db-op");
const { userWithdraw } = require("@fjhb/mq-pub-sub");

const symbol = get_config("symbol");

module.exports = async function (req, res, next) {
  const accountName = req.account_name;
  try {
    // 1. 判断该账号是否存在
    // 2. 如果存在, 判断余额是否大于 0 , 如果 小于等于 0 , 那么提示用户 余额不足
    // 3. 使用 消息队列 发送消息, 由 svc 服务 监听, 并 调用 转账 合约, 为 该 账号 转账

    const eosAccountInfo = await eos_account.get_by_account_name(accountName);
    if (eosAccountInfo == null) {
      logger.warn(`该账号不存在, account_name: ${accountName}`);
      return res.send(get_status("找不到 eos 账户"));
    }

    const accountBalance = Number(eosAccountInfo.balance);
    if (accountBalance <= 0) {
      logger.info(`该账号余额不足, account_name: ${accountName}, balance: ${accountBalance}, ip: ${req.ip}`);
      return res.send(get_status("提现余额不足"));
    }

    // 目前 代币 只有 EOS, 并且一次性提取完
    const withdrawData = {
      "account_name": accountName,
      "amount": accountBalance,
      "symbol": symbol.EOS
    };
    logger.debug(`发布提现消息, withdrawData: %j`, withdrawData);

    await userWithdraw.pub(withdrawData);

    logger.debug(`发布提现消息, 成功...`);

    res.send(get_status(1, "提现进行中, 请稍后刷新查看"));
  } catch (err) {
    logger.error(err, `用户提现时, 报错了, account_name: ${accountName}`);
    next(err);
  }
}
