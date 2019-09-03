// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/pools/bingo.js": "bingo pool" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js");
const { PK_POOL } = require("../../common/constant/accountConstant.js");
const { getPkAccountList, getOneAccount, getPkHistory } = require("../../models/systemPool");
const { Decimal } = require("decimal.js");
const df = require("date-fns");

// bingo 奖池详情
async function pk(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        let rows = await getOneAccount(PK_POOL);
        if (!rows) {
            logger.debug(`system account ${ PK_POOL } not found`);
            return res.send(get_status(1014, "pk pool does not exists"));;
        }
        let pkHistory = await getPkHistory();
        if (!pkHistory) {
            return res.send(get_status(1014, "pk pool does not exists"));
        }

        if (!pkHistory.issue) {
            pkHistory.issue = 0;
        }

        let pkPoolAmount = new Decimal(rows.pool_amount);
        let issue = new Decimal(pkHistory.issue).abs();
        // 本次分配的金额
        let distrEnable = pkPoolAmount.mul(INCOME_CONSTANT.REFER_PK_ALLOCATE_RATE / INCOME_CONSTANT.BASE_RATE);
        let pkAccountList = await getPkAccountList();
        let detail = pkAccountList.map((item, idx) => {
            let rate = setRate(idx);
            // let obj = {}
            // if (idx < 4) {
            const obj = {
                    percentage: `${ rate }%`
                }
            // }
            return {
                "account_name": item.referrer_name,
                "sub_account": item.invite_count,
                ...obj,
                "bonus": distrEnable.mul(rate).toFixed(4)
            }
        })

        const now = new Date();
        resData["data"] = {
            current_amount: pkPoolAmount.toFixed(4),
            issue: new Decimal(issue).toFixed(4),
            total: pkPoolAmount.add(issue).toFixed(4),
            detail: detail,
            start_time: df.format(df.startOfWeek(now), "YYYY-MM-DD HH:mm:ssS"),
            end_time: df.format(df.endOfWeek(now), "YYYY-MM-DD HH:mm:ssS"),
            dividend_rate: INCOME_CONSTANT.REFER_PK_ALLOCATE_RATE
        };
        res.send(resData);
    } catch (err) {
        logger.error("request pk error, the error stock is %O", err);
        throw err;
    }
}

function setRate(rank) {
    let rate = 0;
    if (rank === 0) {
        rate = INCOME_CONSTANT.PK_INCOME_FIRST / INCOME_CONSTANT.BASE_RATE;
    } else if (rank === 1) {
        rate = INCOME_CONSTANT.PK_INCOME_SECOND / INCOME_CONSTANT.BASE_RATE;
    } else if (rank === 2) {
        rate = INCOME_CONSTANT.PK_INCOME_THIRD / INCOME_CONSTANT.BASE_RATE;
    } else if (rank === 3) {
        rate = INCOME_CONSTANT.PK_INCOME_FOURTH / INCOME_CONSTANT.BASE_RATE;
    } else {
        rate = INCOME_CONSTANT.PK_INCOME_FIFTH / INCOME_CONSTANT.BASE_RATE;
    }

    return rate;
}

module.exports = pk;