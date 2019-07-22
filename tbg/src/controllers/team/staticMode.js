// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/team/staticMode.js": "static mode" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getUserSubAccount } = require("../../models/subAccount");
const { getCurrentMaxLevel, getLevelCount, getInviteAccountCount } = require("../../models/subAccount")

// 三三排位
async function staticMode(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug("the param is: %O", reqData);
        let accountName = reqData.account_name;
        let resData = get_status(1);
        // 查找当前三三静态最大的层
        const maxLevel = await getCurrentMaxLevel(accountName);
        // 查找当前三三静态最大的层的子帐号数
        let maxLevelSubAccountCount = await getLevelCount(accountName);
        // console.log("selectMaxLevelSubAccountCount: ", selectMaxLevelSubAccountCount);
        if (!maxLevelSubAccountCount) {
            resData['data'] = [];
            return res.send(resData);
        }
        // 查找当前用户在三三静态每层的子帐号数
        const inviteSubAccountList = await getInviteAccountCount(accountName);
        const subAccountList = await getUserSubAccount(accountName);
        const teamLevelArr = []
        for (let i = 1; i <= maxLevel; i++) {
            let count = 0;
            if (i === maxLevel) {
                count = Math.pow(3, i) - maxLevelSubAccountCount;
            }
            let detail = {
                "level": i,
                "has_account": maxLevelSubAccountCount,
                "invite_account": inviteSubAccountList.filter(item => item.level === i).length,
                "repeat_account": subAccountList.filter((item, idx) => idx > 0 && item.level === i).length,
                "last_account": count
            }
            teamLevelArr.push(detail);
        }

        // console.log("teamLevelArr: ", teamLevelArr);
        resData["data"] = teamLevelArr;
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = staticMode;