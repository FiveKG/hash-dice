// @ts-check
const { MEMBER_LEVEL } = require("./constant/assetsConstant.js");
/**
 * 会员等级 直接推荐会员数
 * 海蓝会员 0 -5 个会员
 * 紫晶会员 6 - 15 个会员
 * 黄金会员 16 - 30 个会员
 * 红钻会员 31 - 50 个会员
 * 皇冠会员 51 个会员以上
 * @param { number } count 
 * @returns {{ NAME: string, ID: string }}
 */
function userMember(count) {
    let level = null;
    if (count < 6) {
        level = MEMBER_LEVEL.SEA_BLUE
    } else if (count < 16) {
        level = MEMBER_LEVEL.AMETHYST
    } else if (count < 31) {
        level = MEMBER_LEVEL.GOLD
    } else if (count < 52) {
        level = MEMBER_LEVEL.RED_DIAMOND
    } else {
        level = MEMBER_LEVEL.CROWN
    }

    return level
}

module.exports = userMember