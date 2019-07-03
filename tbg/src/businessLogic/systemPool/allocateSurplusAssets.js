// @ts-check
const logger = require("../../common/logger.js").child({ "@src/models/account/userInvestment.js": "user investment" });
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const { DEV_OP_POOL, COMMUNITY_POOL } = require("../../common/constant/accountConstant.js");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount } = require("../../models/systemPool");

/** 
 * 处理分配剩余的那部分资产，分别转入社区账号和设计、技术账号
 * @param { any } client 
 * @param { DB.systemPools[] } systemAccount 
 * @param { any } referIncome 发放的总额
 * @param { any } distributed 剩余的额度
 * @param { String } allocateType 分配类型
 */
async function allocateSurplusAssets(client, systemAccount, referIncome, distributed, allocateType) {
    try {
        // 找到社区账号和设计、技术账号
        const devAccount = systemAccount.find(item => item.pool_type === DEV_OP_POOL );
        const communityAccount = systemAccount.find(item => item.pool_type === COMMUNITY_POOL  );
        console.debug("devAccount: ", devAccount);
        console.debug("communityAccount: ", communityAccount);
        if (!devAccount) {
            logger.debug(`system account ${ DEV_OP_POOL } not found`);
            throw new Error(`system account ${ DEV_OP_POOL } not found`);
        }
        if (!communityAccount) {
            logger.debug(`system account ${ COMMUNITY_POOL } not found`);
            throw new Error(`system account ${ COMMUNITY_POOL } not found`);
        }
        // 减去已经发放的
        const last = referIncome.minus(distributed);
        const devChangeAmount = last.mul(INCOME_CONSTANT.DEV_INCOME / INCOME_CONSTANT.BASE_RATE);
        const communityChangeAmount = last.mul(INCOME_CONSTANT.COMMUNITY_INCOME / INCOME_CONSTANT.BASE_RATE);
        const devRemark = `Allocating ${ allocateType } income, ${ DEV_OP_POOL } add ${ devChangeAmount } amount`;
        const communityRemark = `Allocating ${ allocateType } income, ${ COMMUNITY_POOL } add ${ communityChangeAmount } amount`;
        const opType = 'Allocating surplus assets';
        logger.debug(`distributed: ${ distributed }, last: ${ last }`);
        await insertSystemOpLog(client, devChangeAmount, devAccount.pool_amount, opType, devRemark);
        await updateSystemAmount(client, DEV_OP_POOL, devChangeAmount, devAccount.pool_amount);
        await insertSystemOpLog(client, communityChangeAmount, communityAccount.pool_amount, opType, communityRemark);
        await updateSystemAmount(client, COMMUNITY_POOL, devChangeAmount, communityAccount.pool_amount);
    } catch (err) {
        console.error("Allocating surplus assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = allocateSurplusAssets