// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/tbg/checkIn.js": "签到" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { CHECK_IN_AIRDROP_ID, AIRDROP, CHECK_IN_AIRDROP_1 } = require("../../common/constant/tbgAllocateRate");
const { TBG_TOKEN_SYMBOL, TBG_TOKEN } = require("../../common/constant/eosConstants");
const { getAccountInfo } = require("../../models/account");
const { getCurrencyBalance, getCurrencyStats } = require("../../job/getTrxAction.js");
const { getSystemLogInfo, insertSystemOpLog } = require("../../models/systemOpLog");
const { getBalanceLogInfo } = require("../../models/balanceLog");
const { insertBalanceLog } = require("../../models/balance");
const { updateTbgBalance } = require("../../models/tbgBalance");
const { insertAccountOp } = require("../../models/accountOp");
const { Decimal } = require("decimal.js");
const { pool } = require("../../db");

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

        const { [TBG_TOKEN_SYMBOL]: { max_supply } } = await getCurrencyStats(TBG_TOKEN, TBG_TOKEN_SYMBOL);
        // max_supply ~ 1.0000 TBG, 先拆分，拿到数量
        const maxSupply = new Decimal(max_supply.split(" ")[0]);

        // 查询用户的签到空投记录
        const systemOpLogInfo = await getSystemLogInfo(TBG_TOKEN);
        const checkInLog = systemOpLogInfo.find(q => q.op_type === CHECK_IN_AIRDROP_ID);
        const checkInAirdropInfo = AIRDROP.find(it => it.id === CHECK_IN_AIRDROP_ID);       
        const amount = maxSupply.mul(checkInAirdropInfo.rate);
        const quantity = !!checkInLog ? new Decimal(checkInLog.total) : 0;
        // 如果到达空投占比，则不再空投
        if (amount.eq(quantity)) {
            return res.send(get_status(1, { "data": { "income": 0 } }))
        }

        // 获取用户代币资产
        const [ balanceInfo ] = await getCurrencyBalance(TBG_TOKEN, TBG_TOKEN, TBG_TOKEN_SYMBOL);
        const balance = new Decimal(balanceInfo.split(" ")[0]);
        const balanceLogInfo = await getBalanceLogInfo({ accountName: accountName, opType: CHECK_IN_AIRDROP_ID });

        let income = 0;
        // 如果用户每天不是每天都签到，则收益从最近一个连续的地方开始算, 即从最新的一次签到开始累加
        if (balanceLogInfo.length === 0) {
            income = CHECK_IN_AIRDROP_1;
        } else {
            income = new Decimal(balanceLogInfo[0].change_amount).add(CHECK_IN_AIRDROP_1).toNumber();
        }

        let resData = get_status(1);
        resData["data"] = {
            "income": income
        }

        const now = new Date();
        const balanceRemark = `user ${ accountName } at ${ now } check in, get airdrop ${ income }`;
        const systemRemark = `user ${ accountName } at ${ now } check in, ${ TBG_TOKEN } airdrop ${ income }`
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // todo
            // 插入记录
            await insertAccountOp(client, accountName, CHECK_IN_AIRDROP_ID, `user ${ accountName } at ${ now } check in`);
            await updateTbgBalance(client, accountName, income, 0, 0);
            await insertBalanceLog(client, accountName, income, 0, CHECK_IN_AIRDROP_ID, {}, balanceRemark, now);
            await insertSystemOpLog(client, new Decimal(-income), balance.toNumber(), { "aid": TBG_TOKEN }, CHECK_IN_AIRDROP_ID, systemRemark, now);
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