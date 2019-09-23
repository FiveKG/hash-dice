// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/game/bonus_pool" });
const { get_status, get_config } = require("../../common");
const { 
  common_data: commonDataBiz, 
  system_bonus: systemBonusLogBiz, 
  system_symbol_log: systemSymbolLogBiz
} = require("@fjhb/db-op");

const symbol = get_config("symbol");

module.exports = async function (req, res, next) {
  try {
    const [
      bonus_pool_amount_info,
      allocate_bonus,
      release_symbol_amount
    ] = await Promise.all([
      commonDataBiz.get_by_pk(commonDataBiz.primaryKeys.bonus_pool_amount),
      systemBonusLogBiz.getOutAmountTotal(),
      systemSymbolLogBiz.getOutAmountTotal(symbol.CLUB)
    ]);

    const responseData = {
      "unallocate_bonus"     : bonus_pool_amount_info ? Number(bonus_pool_amount_info.data_value) : 0,
      "allocate_bonus"       : Number(allocate_bonus) || 0,
      "release_symbol_amount": Number(release_symbol_amount) || 0
    };
    
    res.send(get_status(1, responseData));
  } catch (err) {
    logger.error(err, `获取[分红池]时报错了`);
    next(err);
  }
}
