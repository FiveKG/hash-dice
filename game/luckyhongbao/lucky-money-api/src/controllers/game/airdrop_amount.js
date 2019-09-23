// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/game/airdrop_amount" });
const { get_status, get_config } = require("../../common");
const {
  system_symbol_log: systemSymbolLogBiz
} = require("@fjhb/db-op");

const symbol = get_config("symbol");

module.exports = async function (req, res, next) {
  try {
    const amount = await systemSymbolLogBiz.getOutAmountTotal(symbol.CLUB);

    res.send(get_status(1, { amount }));
  } catch (err) {
    logger.error(err, "获取[已空投的代币数量]时失败了");
    next(err);
  }
}
