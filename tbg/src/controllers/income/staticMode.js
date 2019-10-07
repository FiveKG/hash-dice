// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "三三排位收益详情" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getStaticModeIncome, getGroupIncome, getUserBalance } = require("../../models/balance");
const { Decimal } = require("decimal.js");
const OPT_CONSTANTS = require("../../common/constant/optConstants.js");

// 三三排位收益详情
async function staticMode(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        let resData = get_status(1);
        let page = reqData.page;
        let limit = reqData.limit;
        let accountName = reqData.account_name;
        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 10;
        }

        let userBalance = await getUserBalance(accountName);
        if (!userBalance) {
            return res.send(get_status(1001, "this account does not exists"));
        }

        let groupIncome = await getGroupIncome(accountName);
        let referIncome = new Decimal(0);
        let sortIncome =new Decimal(0);
        let modeIncome = new Decimal(0);
        let otherIncome =new Decimal(0);
        if (groupIncome) {
            for (let i = 0; i < groupIncome.length; i++) {
                let item = groupIncome[i];
                if (item.op_type === OPT_CONSTANTS.INVITE) {
                    referIncome = referIncome.add(item.total);
                } else if (item.op_type === OPT_CONSTANTS.SORT) {
                    sortIncome = sortIncome.add(item.total);
                } else if (item.op_type === OPT_CONSTANTS.MODE) {
                    modeIncome = modeIncome.add(item.total);
                } else if (item.op_type === OPT_CONSTANTS.REPEAT) {
                    continue;
                } else {
                    otherIncome = otherIncome.add(item.total);
                }
            }
        }
        
        let rows = await getStaticModeIncome(reqData.account_name, limit, page);
        let detail = rows.map(item => {
            let remark = item.remark
            return {
                "create_time": item.create_time,
                "sub_account": remark.split(",")[0].split("-")[1],
                "sub_level": remark.split(",")[2].split(" ")[2],
                "income": remark.split(",")[1].split(" ")[2]
            }
        });
        resData["data"] = {
            total_income: new Decimal(userBalance.amount).toFixed(8),
            refer_income: referIncome.toFixed(8),
            mode_income: modeIncome.toFixed(8),
            sort_income: sortIncome.toFixed(8),
            other_income: otherIncome.toFixed(8),
            detail: detail
        };

        res.send(resData);
    } catch (err) {
        logger.error("request income staticMode error, the error stock is %O", err);
        throw err;
    }
}

module.exports = staticMode;