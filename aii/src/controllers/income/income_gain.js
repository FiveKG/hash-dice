// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/income/income_gain.js": "收取收益" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { personalAssetChange } = require("../../models/asset");
const { getUserBalance } = require("../../models/balance");
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
        let flag = incomeType === "all" || incomeType === "invite" || incomeType === "bingo" || incomeType === "pk" || incomeType === "safe" || incomeType === "holder" || incomeType === "game" || incomeType === "sort" || incomeType === "mode"
        if (!flag) {
            return res.send(get_status(2002, "request params value is invalid"));
        }

        let detailArr = []
        let resDate = get_status(1);
        let incomeMap = await redis.hgetall(`income:${ accountName }`);
        // console.log("incomeMap: ", incomeMap);
        if (incomeType === "all") {
            for (let key in incomeMap) {
                await startGain(incomeMap, key);
            }
            await redis.del(`income:${ accountName }`);
        } else {
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

async function startGain(incomeMap, incomeType) {
    let incomeJsonIfy = incomeMap[incomeType];
    if (!incomeJsonIfy) {
        return;
    }
    console.log("incomeJsonIfy: ", incomeJsonIfy);
    let incomeArr = JSON.parse(incomeJsonIfy);
    for (let item of incomeArr) {
        let changeAmount = new Decimal(item.change_amount);
        console.log("item: ", item);
        await personalAssetChange(pool, item.account_name, changeAmount, item.op_type, item.remark, df.format(item.create_time, "YYYY-MM-DD HH:mm:ssZ"));
    }
}

module.exports = incomeGain;