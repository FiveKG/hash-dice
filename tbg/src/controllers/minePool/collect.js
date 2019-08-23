// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/minePool/collect.js": "资产包挖矿收益收取" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { updateTbgBalance } = require("../../models/tbgBalance");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { TBG_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { insertBalanceLog } = require("../../models/balance");
const df = require("date-fns");
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { pool } = require("../../db");

// 资产包挖矿收益收取
// @ts-ignore
async function collect(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const { account_name: accountName, mining_id: miningId } = reqData;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        // 购买资产包成功后，开始生成挖矿包，从交易完成时开始计算挖矿时间
        const now = new Date();
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, "symbol": TBG_TOKEN_SYMBOL });
        let currentBalance = !!balanceLogInfo[0] ? new Decimal(balanceLogInfo[0].current_balance) : 0;
        // 过滤出当前所有的挖矿记录
        const miningIds = miningId.split(",");
        const miningInfo = balanceLogInfo.map(it => it.op_type === OPT_CONSTANTS.MINING && miningIds.includes(it.extra.tr_id))
        // 如果还没收取过挖矿收益
        if (miningInfo.length === 0) {
            return res.send(get_status(1));
        }

        // 收取过挖矿收益，找到最新的一条, 判断是否超过 24h
        const trxList = [];
        const minedMap = new Map();
        for (const info of miningInfo) {
            // @ts-ignore
            const logInfo = minedMap.get(info.extra.tr_id);
            if (logInfo) {
                const diff = df.differenceInHours(now, logInfo.create_time);
                if (diff >= 24) {
                    // 如果超过 24h 未收取，则可以收取，否则不做处理
                    const extra = logInfo.extra;
                    // 计算收益, 购买资产包时，将资产包信息存入 extra
                    const releaseAmount = new Decimal(extra.mining_multiple).mul(extra.amount).div(logInfo.extra.preset_days);
                    const remark = `user ${ accountName } collect mining income, amount is ${ releaseAmount.toNumber() }`;
                    currentBalance = releaseAmount.add(currentBalance);
                    const data = {
                        "updateTbgBalance": [ accountName, releaseAmount.toNumber(), 0, 0 ],
                        "insertBalanceLog": [ accountName, releaseAmount.toNumber(), currentBalance.toNumber(), OPT_CONSTANTS.MINING, logInfo.extra, remark, now ]
                    }
                    trxList.push(data)
                }
            } else {
                // @ts-ignore
                minedMap.set(info.extra.tr_id, info);
            }
        }

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                // @ts-ignore
                updateTbgBalance(client, ...it.insertBalanceLog),
                // @ts-ignore
                insertBalanceLog(client, ...it.updateTbgBalance)
            }))
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
        
        res.send(get_status(1));
    } catch (err) {
        logger.error("request collect error, the error stock is %O", err);
        throw err
    }
}

module.exports = collect;