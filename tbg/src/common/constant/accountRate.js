// @ts-check
const accountConstant = require("./accountConstant.js");
const rateConstant = require("./investConstant.js");

/**
 * 系统帐号对应的收益率
 * @type { AccountRate }
 */
const accountRate = {
    [accountConstant.SAFE_POOL]: rateConstant.SAFE_INCOME_RATE,
    [accountConstant.MODE_POOL]: rateConstant.MODE_INCOME_RATE,
    [accountConstant.SORT_POOL]: rateConstant.SORT_INCOME_RATE,
    [accountConstant.BINGO_POOL]: rateConstant.BINGO_INCOME_RATE,
    [accountConstant.PK_POOL]: rateConstant.PK_INCOME_RATE,
    [accountConstant.SHAREHOLDERS_POOL]: rateConstant.SHAREHOLDERS_INCOME_RATE,
    [accountConstant.COMMUNITY_POOL]: rateConstant.COMMUNITY_INCOME_RATE,
    [accountConstant.DEV_OP_POOL]: rateConstant.DEV_OP_INCOME_RATE,
    [accountConstant.TSH_INCOME]: rateConstant.TSH_INCOME_RATE,
}

module.exports = {
    "accountRate": accountRate
};

/**
 * @description 系统帐号对应的收益率
 * @typedef { Object } AccountRate
 */