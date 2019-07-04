// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/income/income_gain.js": "收取收益" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserBalance, updateBalance, insertBalanceLog } = require("../../models/balance/index");
const { Decimal } = require("decimal.js");
const { redis } = require("../../common");
const { startParse } = require("../../common/parseIncomeData");
const df = require("date-fns");

// 收取收益
async function incomeGain(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of gain income is: ${ JSON.stringify(reqData) }`);
        let accountName = reqData.account_name;
        let incomeType = reqData.income_type;
        const incomeTypeList = [ "all", "invite", "bingo", "pk", "safe", "holder", "game", "sort", "mode" ];
        if (!incomeTypeList.includes(incomeType)) {
            return res.send(get_status(2002, "request params value is invalid"));
        }

        let detailArr = []
        let resDate = get_status(1);
        let incomeMap = await redis.hgetall(`tbg:income:${ accountName }`);
        // console.log("incomeMap: ", incomeMap);
        // 一键收取全部收益
        if (incomeType === "all") {
            for (let key in incomeMap) {
                await startGain(incomeMap, key);
            }
            await redis.del(`income:${ accountName }`);
        } else {
            // 删掉收取过的数据，重新赋值
            await startGain(incomeMap, incomeType);
            await redis.hdel(`income:${ accountName }`, incomeType);
            incomeMap = await redis.hgetall(`income:${ accountName }`);
            detailArr = await startParse(incomeMap);
        }

        let rows = await getUserBalance(accountName);
        logger.debug(`gain income rows: ${ JSON.stringify(rows) }`);
        if (!rows) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let amount = new Decimal(rows.amount);
        let data = {
            "total_income": amount.toFixed(8),
            "detail": detailArr
        }
        resDate["data"] = data;
        res.send(resDate);
    } catch (err) {
        throw err
    }
}

/**
 * 按类型收取
 * @param { Object } incomeMap 
 * @param { String } incomeType 
 */
async function startGain(incomeMap, incomeType) {
    let incomeJsonIfy = incomeMap[incomeType];
    if (!incomeJsonIfy) {
        return;
    }
    const client = await pool.connect();
    try {
        console.log("incomeJsonIfy: ", incomeJsonIfy);
        let incomeArr = JSON.parse(incomeJsonIfy);
        for (let item of incomeArr) {
            const accountName = item.account_name;
            let changeAmount = new Decimal(item.change_amount);
            let rows = await getUserBalance(accountName);
            console.log("item: ", item);
            const createTime = df.format(item.create_time, "YYYY-MM-DD HH:mm:ssZ");
            await client.query("BEGIN");
            await updateBalance(client, accountName, changeAmount);
            await insertBalanceLog(client, accountName, changeAmount.toFixed(8), rows.amount, item.op_type, item.remark, createTime)
            await client.query("COMMIT");
        }
    } catch (err) {
        throw err;
    }
}

module.exports = incomeGain;