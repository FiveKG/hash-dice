// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/team/staticSort.js": "static sort" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getStaticSort, getUserSubAccount } = require("../../models/account");

// 一行公排
async function staticSort(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        // 一行公排
        let rows = await getStaticSort();
        // 该用户的子帐号
        let subAccountList = await getUserSubAccount(reqData.account_name);
        let sort = rows.user_level;
        if (!sort.length) {
            return res.send(get_status(1006, "static sort is empty"));
        }

        let len = subAccountList.length;
        if (!len) {
            return res.send(get_status(1007, "subAccount does not exists"));
        }

        let result = subAccountList.map(item => {
            let account = item.sub_account_name;
            return {
                sub_account: account.split("-")[1],
                sort: sort.indexOf(account)
            }
        });

        let resData = get_status(1);
        resData["data"] = result;
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = staticSort;