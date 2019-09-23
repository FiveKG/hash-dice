// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/club/leaderboard" });
const { get_status } = require("../../common");
const {
  club       : clubBiz,
  common_data: commonDataBiz
} = require("@fjhb/db-op");

module.exports = async function (req, res, next) {
  try {
    const [
      bonusPoolAmountInfo,
      rankList
    ] = await Promise.all([
      commonDataBiz.get_by_pk(commonDataBiz.primaryKeys.bonus_pool_amount),
      clubBiz.getRankList(10, new Date())
    ]);

    const responseData = {
      bonus_amount: bonusPoolAmountInfo ? Number(bonusPoolAmountInfo.data_value) : 0,
      rank_list: rankList
    };

    res.send(get_status(1, responseData));
  } catch (err) {
    logger.error(err, "获取[俱乐部排行榜]时失败了");
    next(err);
  }
}
