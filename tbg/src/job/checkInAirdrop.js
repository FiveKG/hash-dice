// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/checkInAirdrop.js": "签到空投" });
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const { TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { format } = require("date-fns");
const { scheduleJob } = require("node-schedule");

logger.debug("checkInAirdrop running")
scheduleJob("0 0 0 */1 * *", checkInAirdrop);
/**
 * 签到空投
 * 从日志中找出今日所有的签到用户
 * 每日0点将本日签到所有的空投数量
 * 由发币账号转至释放池账号
 * 直至签到空投数量空投完毕后中止
 */
async function checkInAirdrop() {
    try {
        const sql = `
            SELECT * FROM balance_log WHERE op_type = $1 AND create_time BETWEEN CAST($2 AS DATE) - 1 AND $2
        `
        const now = new Date();
        const { rows: checkInList } = await pool.query(sql, [ OPT_CONSTANTS.CHECK_IN, now ]);
        const actionList = checkInList.map(it => {
            return {
                account: TBG_TOKEN_COIN,
                name: "transfer",
                authorization: [{
                    actor: TBG_TOKEN_COIN,
                    permission: 'active',
                }],
                data: {
                    from: TBG_TOKEN_COIN,
                    to: TBG_FREE_POOL,
                    quantity: `${ new Decimal(it.change_amount).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: `${ format(now, "YYYY-MM-DD : HH:mm:ssZ") } check in airdrop`
                }
            }
        });

        // 发送区块链转帐消息
        await psTrx.pub(actionList);
    } catch (err) {
        logger.error("check in airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkInAirdrop