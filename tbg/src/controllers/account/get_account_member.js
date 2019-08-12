// @ts-check
const logger = require("../../common/logger.js").child({ "@controllers/account/getAccountMember.js": "get account member" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getAccountMemberLevel } = require("../../models/account");

// 获取当前用户等级
async function getAccountMember(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param of getAccountMember is: %j`, reqData);
        let userMemberLevel = await getAccountMemberLevel(reqData.account_name);
        if (!userMemberLevel) {
            return res.send(get_status(1001, "this account does not exists"));
        }
        let resData = get_status(1);
        let data = {
            "invest_count": userMemberLevel.count,
            "tbg1": false,
            "tbg2": false,
            "level": userMember(userMemberLevel.count)
        }
        if (userMemberLevel.state === 30) {
            data.tbg1 = true
            data.tbg2 = true
        } 
        
        if (userMemberLevel.state === 20) {
            data.tbg2 = true
        } 
        
        if (userMemberLevel.state === 10) {
            data.tbg1 = true
        }
        resData["data"] = data;
        res.send(resData);
    } catch (err) {
        logger.error("request getAccountMember error, the error stock is %O", err);
        throw err;
    }
}

module.exports = getAccountMember;

/**
 * 会员等级 直接推荐会员数
 * 海蓝会员 0 -5 个会员
 * 紫晶会员 6 - 15 个会员
 * 黄金会员 16 - 30 个会员
 * 红钻会员 31 - 50 个会员
 * 皇冠会员 51 个会员以上
 * @param { number } count 
 * @returns { String }
 */
function userMember(count) {
    let level = '';
    if (count < 6) {
        level = "海蓝会员"
    } else if (count < 16) {
        level = "紫晶会员"
    } else if (count < 31) {
        level = "黄金会员"
    } else if (count < 52) {
        level = "红钻会员"
    } else {
        level = "皇冠会员"
    }

    return level
}