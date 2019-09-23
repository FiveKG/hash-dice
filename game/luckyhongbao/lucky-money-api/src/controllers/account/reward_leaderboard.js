// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/reward_leaderboard" });
const { get_status } = require("../../common");
const {
  account_balance_log: accountBalanceLogBiz
} = require("@fjhb/db-op");

module.exports = async function (req, res, next) {
  try {
    const rankList = await accountBalanceLogBiz.getRewardRankList(10, new Date());

    res.send(get_status(1, rankList));
  } catch (err) {
    logger.error(err, "获取[奖金排行榜]时报错了");
    next(err);
  }
}
