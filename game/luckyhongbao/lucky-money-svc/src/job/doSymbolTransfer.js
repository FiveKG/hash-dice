// @ts-check
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "doSymbolTransfer" });
const queue = require("../common/redis_queue");
const chainOp = require("../common/chainOperate");

setInterval(symbolTransferAction, 500);

async function symbolTransferAction() {
  try {
    logger.debug(`执行代币转账操作 beginning.... `);
    const symbolTransferInfo = await queue.symbolTransfer.pop();
    if (symbolTransferInfo) {
      logger.info(`开始执行代币转账操作, symbolTransferInfo: ${JSON.stringify(symbolTransferInfo)}`);
      
      let responseData = null;
      try {
        responseData = await chainOp.directTransfer(
          symbolTransferInfo.account_name, 
          symbolTransferInfo.symbol,
          symbolTransferInfo.amount, 
          symbolTransferInfo.memo
        );
      } catch (err) {
        await queue.symbolTransfer.push([symbolTransferInfo]);
        throw err;
      }

      if (responseData) {
        const { status, cpu_usage_us, net_usage_words } = responseData.processed.receipt;
        logger.info(`执行代币转账操作完成, status: ${status}, cpu_usage_us: ${cpu_usage_us}, net_usage_words: ${net_usage_words}`);
      }
    }
    logger.debug(`执行代币转账操作 stopping....`);
  } catch (err) {
    logger.error(err, "执行代币转账时报错了");
  }
}
