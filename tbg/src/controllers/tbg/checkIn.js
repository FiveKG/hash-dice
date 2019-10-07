// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "签到" });
const { get_status, inspect_req_data, redis } = require("../../common/index.js");
const { CHECK_IN_AIRDROP_ID, AIRDROP, CHECK_IN_AIRDROP_1, CHECK_IN_AIRDROP_7 } = require("../../common/constant/tbgAllocateRate");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");
const { TBG_TOKEN_SYMBOL } = require("../../common/constant/eosConstants");
const { TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../../common/constant/accountConstant");
const { getAccountInfo } = require("../../models/account");
const { getCurrencyStats } = require("../../job/getTrxAction.js");
const { getBalanceLogByTerm } = require("../../models/balanceLog");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { insertBalanceLog } = require("../../models/balance");
const { updateTbgBalance, getTbgBalanceInfo } = require("../../models/tbgBalance");
const { insertAccountOp } = require("../../models/accountOp");
const { Decimal } = require("decimal.js");
const { pool } = require("../../db");
const df = require("date-fns");

// 签到
async function checkIn(req, res, next) {
    try {
        const reqData = await inspect_req_data(req);
        logger.debug(`the param is %j: `, reqData);
        const accountName = reqData.account_name;
        const accountInfo = await getAccountInfo(accountName);
        if (!accountInfo) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        // 获取用户签到记录
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, "symbol": TBG_TOKEN_SYMBOL });
        const tbgBalance = await getTbgBalanceInfo(accountName);
        let income = 0;
        // let currentBalance = !!balanceLogInfo[0] ? balanceLogInfo[0].current_balance : 0;
        let currentBalance = tbgBalance.release_amount;
        const checkInLog = balanceLogInfo.filter(it => it.op_type === OPT_CONSTANTS.CHECK_IN);
        // 如果用户每天不是每天都签到，收益从最近一个连续的地方开始算, 即从最新的一次签到开始累加
        if (checkInLog.length === 0) {
            income = CHECK_IN_AIRDROP_1;
        } else {
            // 先判断当天是否已经签到过
            if (df.isToday(checkInLog[0].create_time)) {
                return res.send(get_status(1019, "today already check in"));
            } else if (df.isYesterday(checkInLog[0].create_time)) {
                // 如果连续七天都签到了，从头算起, 否则一直累加
                if (checkInLog[0].change_amount === CHECK_IN_AIRDROP_7) {
                    income = new Decimal(CHECK_IN_AIRDROP_1).toNumber();
                } else {
                    income = new Decimal(checkInLog[0].change_amount).add(CHECK_IN_AIRDROP_1).toNumber();
                }
            } else {
                // 如果昨天没签到，则从一开始算起
                income = new Decimal(CHECK_IN_AIRDROP_1).toNumber();
            }
        }

        currentBalance = new Decimal(currentBalance).add(income).toNumber();
        // 如果到达空投占比，则不再空投
        // 查询用户的签到空投记录
        const { [TBG_TOKEN_SYMBOL]: { max_supply } } = await getCurrencyStats(TBG_TOKEN_COIN, TBG_TOKEN_SYMBOL);
        // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
        const maxSupply = new Decimal(max_supply.split(" ")[0]);
        const total = await getBalanceLogByTerm({ symbol: TBG_TOKEN_SYMBOL, opType: OPT_CONSTANTS.CHECK_IN });
        const checkInAirdropInfo = AIRDROP.find(it => it.id === CHECK_IN_AIRDROP_ID);       
        const amount = maxSupply.mul(checkInAirdropInfo.rate);
        const quantity = !!total ? new Decimal(total).add(income).toNumber() : 0;
        if (amount.lessThan(quantity)) {
            return res.send(get_status(1018, "check in airdrop quota has been used up"))
        }

        let resData = get_status(1);
        resData["data"] = {
            "income": income
        }

        const now = new Date();
        const balanceRemark = `user ${ accountName } at ${ now } check in, get airdrop ${ income }`;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // 插入记录
            await insertAccountOp(client, accountName, OPT_CONSTANTS.CHECK_IN, `user ${ accountName } at ${ now } check in`);
            // 空投先进入线性释放池，每日零点释放后转入用户的帐户中, 同时写一条记录
            await updateTbgBalance(client, accountName, income, 0, 0);
            await insertBalanceLog(client, accountName, income, currentBalance, OPT_CONSTANTS.CHECK_IN, { "symbol": TBG_TOKEN_SYMBOL, "op_type": OPT_CONSTANTS.RELEASE }, balanceRemark, now);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        res.send(resData);
    } catch (err) {
        logger.error("request checkIn error, the error stock is %O", err);
        throw err;
    }
}

module.exports = checkIn;