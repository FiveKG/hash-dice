// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/team/staticSort.js": "static sort" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getStaticSort } = require("../../models/account");
const { getUserSubAccount } = require("../../models/subAccount");

// 一行公排
async function staticSort(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        // 一行公排的查出所有子帐号
        const rows = await getStaticSort();
        let resData = get_status(1);
        if (rows.length === 0) {
            return res.send(get_status(1006, "static sort is empty"));
        }
        const staticSort = rows.map(item => item.sub_account_name);
        // 该用户的子帐号
        let subAccountList = await getUserSubAccount(reqData.account_name);

        let len = subAccountList.length;
        if (!len) {
            return res.send(get_status(1007, "subAccount does not exists"));
        }

        let result = subAccountList.map(item => {
            let subAccount = item.sub_account_name;
            return {
                sub_account: subAccount.split("-")[1],
                sort: staticSort.indexOf(subAccount) + 1
            }
        });

        resData["data"] = result;
        res.send(resData);
    } catch (err) {
        logger.error("request staticSort error, the error stock is %O", err);
        throw err
    }
}

module.exports = staticSort;