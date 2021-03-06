// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "资产包挖矿收益收取" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountInfo } = require("../../models/account");
const { updateTbgBalance, getTbgBalanceInfo } = require("../../models/tbgBalance");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { TBG_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");
const { insertBalanceLog } = require("../../models/balance");
const { getTradeInfoHistory, getTradeInfoById } = require("../../models/trade");
const { getAssetsInfoById } = require("../../models/asset");
const df = require("date-fns");
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { pool } = require("../../db");
const { format } = require("date-fns");

// 资产包挖矿收益收取
// 收取后，增加用户的释放资产
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
        const now = format(new Date, "YYYY-MM-DD HH:mm:ssZ");
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, "symbol": TBG_TOKEN_SYMBOL, extraType: OPT_CONSTANTS.MINING });
        logger.debug(`balanceLogInfo: `, balanceLogInfo);
        const tbgBalance = await getTbgBalanceInfo(accountName);
        logger.debug(`tbgBalance: `, tbgBalance);
        let currentBalance = new Decimal(tbgBalance.release_amount);
        // 过滤出当前所有的挖矿记录
        const miningIds = miningId.split(",");
        const trxList = [];
        const miningSet = new Set();
        for (const info of balanceLogInfo) {
            // 每个 id 都只处理一条, 第一条就是上次插入的最新的挖矿包
            const extra = info.extra;
            if (miningSet.has(extra.tr_id)) {
                continue;
            }
            miningSet.add(extra.tr_id);
            logger.debug(`info: `, info);
            // 计算收益, 购买资产包时，将资产包信息存入 extra
            // const tradeInfo = await getTradeInfoById(info.extra.tr_id);
            // const assetsInfo = await getAssetsInfoById([tradeInfo[0].extra.ap_id]);
            const diff = df.differenceInHours(now, extra.finished_time);
            const perHourMining = new Decimal(extra.mining_multiple).mul(extra.amount).div(extra.preset_days).div(24);
            if (miningIds.includes(info.extra.tr_id)) {
                // miningInfo.push(info);
                // 判断一下是否挖矿结束
                if (diff < extra.preset_days * 24) {
                    // 从上一条记录的时间到现在即为挖矿时间
                    const miningTime = df.differenceInHours(now, info.create_time);
                    // 满 24h 才可以收取
                    if (miningTime >= 24) {
                        const releaseAmount = perHourMining.mul(miningTime);
                        const remark = `user ${ accountName } collect mining income, amount is ${ releaseAmount.toNumber() }`;
                        currentBalance = releaseAmount.add(currentBalance);
                        const data = {
                            "updateTbgBalance": [ accountName, releaseAmount.toNumber(), 0, 0 ],
                            "insertBalanceLog": [ accountName, releaseAmount.toNumber(), currentBalance.toNumber(), OPT_CONSTANTS.MINING, extra, remark, now ]
                        }
                        trxList.push(data)
                    }
                }
            }
        }

        logger.debug(`trxList: `, trxList);
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                // @ts-ignore
                updateTbgBalance(client, ...it.updateTbgBalance),
                // @ts-ignore
                insertBalanceLog(client, ...it.insertBalanceLog)
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