// @ts-check
const logger = require("../../common/logger.js").child({ [`@${ __filename }`]: "allocate surplus assets" });
const INCOME_CONSTANT = require("../../common/constant/incomeConstant");
const { DEV_OP_POOL, COMMUNITY_POOL, TSH_INCOME } = require("../../common/constant/accountConstant.js");
const { insertSystemOpLog } = require("../../models/systemOpLog");
const { updateSystemAmount } = require("../../models/systemPool");
const { UE_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");

/** 
 * 处理分配剩余的那部分资产，分别转入社区账号和设计、技术账号
 * @param { any } client 
 * @param { DB.SystemPools[] } systemAccount 
 * @param { any } referIncome 发放的总额
 * @param { any } distributed 剩余的额度
 * @param { String } allocateType 分配类型
 */
async function allocateSurplusAssets(client, systemAccount, referIncome, distributed, allocateType) {
    try {
        // 找到社区账号和设计、技术账号
        // const devAccount = systemAccount.find(item => item.pool_type === DEV_OP_POOL && item.pool_symbol === UE_TOKEN_SYMBOL);
        // const communityAccount = systemAccount.find(item => item.pool_type === COMMUNITY_POOL  && item.pool_symbol === UE_TOKEN_SYMBOL);
        const tshAccount = systemAccount.find(item => item.pool_type === TSH_INCOME && item.pool_symbol === UE_TOKEN_SYMBOL);
        // if (!devAccount) {
        //     logger.debug(`system account ${ DEV_OP_POOL } not found`);
        //     throw new Error(`system account ${ DEV_OP_POOL } not found`);
        // }
        // if (!communityAccount) {
        //     logger.debug(`system account ${ COMMUNITY_POOL } not found`);
        //     throw new Error(`system account ${ COMMUNITY_POOL } not found`);
        // }
        if (!tshAccount) {
            logger.debug(`system account ${ TSH_INCOME } not found`);
            throw new Error(`system account ${ TSH_INCOME } not found`);
        }
        // 减去已经发放的
        const last = referIncome.minus(distributed);
        // const devChangeAmount = last.mul(INCOME_CONSTANT.DEV_INCOME / INCOME_CONSTANT.BASE_RATE);
        // const communityChangeAmount = last.mul(INCOME_CONSTANT.COMMUNITY_INCOME / INCOME_CONSTANT.BASE_RATE);
        // const devRemark = `Allocating ${ allocateType } income, ${ DEV_OP_POOL } add ${ devChangeAmount } amount`;
        // const communityRemark = `Allocating ${ allocateType } income, ${ COMMUNITY_POOL } add ${ communityChangeAmount } amount`;
        const tshRemark = `Allocating ${ allocateType } income, ${ TSH_INCOME } add ${ last } amount`;
        const opType = 'Allocating surplus assets';
        const now = "now()"
        logger.debug(`distributed: ${ distributed }, last: ${ last }`);
        // 开发账户
        // await insertSystemOpLog(client, devChangeAmount, devAccount.pool_amount, { "symbol": UE_TOKEN_SYMBOL, aid: DEV_OP_POOL }, opType, devRemark, now);
        // await updateSystemAmount(client, DEV_OP_POOL, devChangeAmount, devAccount.pool_amount, UE_TOKEN_SYMBOL);
        // // 社区账户
        // await insertSystemOpLog(client, communityChangeAmount, communityAccount.pool_amount, { "symbol": UE_TOKEN_SYMBOL, aid: COMMUNITY_POOL }, opType, communityRemark, now);
        // await updateSystemAmount(client, COMMUNITY_POOL, devChangeAmount, communityAccount.pool_amount, UE_TOKEN_SYMBOL);
        // 股东账户
        await insertSystemOpLog(client, last, tshAccount.pool_amount, { "symbol": UE_TOKEN_SYMBOL, aid: TSH_INCOME }, opType, tshRemark, now);
        await updateSystemAmount(client, TSH_INCOME, last, tshAccount.pool_amount, UE_TOKEN_SYMBOL);
    } catch (err) {
        logger.error("Allocating surplus assets error, the error stock is %O", err);
        throw err;
    }
}

module.exports = allocateSurplusAssets