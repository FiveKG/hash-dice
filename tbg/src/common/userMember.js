// @ts-check
const { MEMBER_LEVEL } = require("./constant/assetsConstant.js");
const { CHECK_IN_AIRDROP_1, CHECK_IN_AIRDROP_2, CHECK_IN_AIRDROP_3,
     CHECK_IN_AIRDROP_4, CHECK_IN_AIRDROP_5, CHECK_IN_AIRDROP_6, CHECK_IN_AIRDROP_7 } = require("./constant/tbgAllocateRate.js");
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
    } else if (count < 51) {
        level = MEMBER_LEVEL.RED_DIAMOND
    } else {
        level = MEMBER_LEVEL.CROWN
    }

    return level
}

/**
 * 每日签到奖励
 * @param { number } days 
 * @returns { number }
 */
function weekCheckIn(days) {
    let income = 0;
    switch (days) {
        case 1:
            income = CHECK_IN_AIRDROP_1;
            break;
        case 2:
            income = CHECK_IN_AIRDROP_2;
            break;
        case 3:
            income = CHECK_IN_AIRDROP_3;
            break;
        case 4:
            income = CHECK_IN_AIRDROP_4;
            break;
        case 5:
            income = CHECK_IN_AIRDROP_5;
            break;
        case 6:
            income = CHECK_IN_AIRDROP_6;
            break;
        default:
            income = CHECK_IN_AIRDROP_7;
            break;
        
    }
    return income
}

module.exports = {
    userMember,
    weekCheckIn
}