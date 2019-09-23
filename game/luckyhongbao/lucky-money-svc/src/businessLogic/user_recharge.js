//@ts-check
// require("../initEnv.js")();
const logger = require("@fjhb/logger").child({ [`@${ __filename }`] : "userRecharge"});
const addAccountBalance = require("@fjhb/db-op").eos_account.add_balance;
const addAccountLog = require("@fjhb/db-op").account_log.create;

/**
 *  处理 用户充值 的 事件。
 * 更新 用户的 余额字段， 增加 账户操作日志.
 *
 * @param {UserRechargeArgv} userRechargeArgv
 */
async function userRecharge(userRechargeArgv) {
    try {
        logger.info(`userRecharge. userRechargeArgv: %j`,userRechargeArgv);
        await addAccountBalance(userRechargeArgv.account_name, userRechargeArgv.amount, "UE 充值" , `充值${userRechargeArgv.amount } ${userRechargeArgv.symbol} . trx_id:${userRechargeArgv.trx_id}`);
        await addAccountLog({"account_name": userRechargeArgv.account_name , "ip_address":"" , "op_type": `充值:${userRechargeArgv.amount} ${userRechargeArgv.symbol} `});
        logger.info(`account: ${userRechargeArgv.account_name} , amount:${userRechargeArgv.amount} ${userRechargeArgv.symbol} recharge success.`);
    } catch (error) {
        logger.error(`user recharge error. `, error);
    }
    
}

/**
 * @typedef UserRechargeArgv
 * @property {string} account_name      发红包的用户
 * @property {number} amount            发的金额
 * @property {string} symbol            币种符号
 * @property {string} trx_id
 */

module.exports = userRecharge;