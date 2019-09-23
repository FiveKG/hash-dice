// @ts-check
require("../../initEnv.js")()
const request = require("request-promise");
const eos_account_biz = require("@fjhb/db-op").eos_account;
const account_refer_biz = require("@fjhb/db-op").account_refer;
const logger = require("@fjhb/logger").child({ "@": "sync_account_refer" });
const config = require("../../config.js");
const { new_account_reward } = require("../common/sysConfig");
const { format } = require("date-fns");

/**
 * 同步 pk10 推荐关系
 * @param { Object } options 请求数据
 */
async function sync_refer(options) {
    try {
        const responseBody = await request(options);

        if (responseBody.code !== 1) {
            logger.warn("get all pk10 account and referrer failed, request paramers: %j", options);
            return;
        }
        const data = responseBody.data;

        // 遍历获取到的数据
        for (let item of data) {
            const agentAccountName = item.account_name;
            let eos_account = await eos_account_biz.get_by_account_name(agentAccountName);
            // let refer = item.lower_list.length === 0 ? "" : item.lower_list[0].account_name;
            // 没有该用户,创建一条
            if (!eos_account) {
                await eos_account_biz.create({ "account_name": agentAccountName });
                
                // 当新增一个用户, 就给此用户 添加余额, 余额的数量 从 系统设置中 获取
                const { amount: rewardAmount } = await new_account_reward.get();
                await eos_account_biz.add_balance(
                    agentAccountName, 
                    rewardAmount, 
                    "新账户返利", 
                    `account_name: ${agentAccountName}, reward_amount: ${rewardAmount}, reward_time: ${format(new Date(), 'YYYY-MM-DD HH:mm:ss')}`
                );
            }

            const lowerAccountNames = item.lower_list;
            // 存在的话查看关系人是否存在, 不存在创建一条.
            for (let lowerAccountName of lowerAccountNames) {
                // 先判断是否存在该账号
                const lowerAccountInfo = await eos_account_biz.get_by_account_name(lowerAccountName);
                if (lowerAccountInfo == null) {
                    await eos_account_biz.create({ "account_name": lowerAccountName, "refer_name": agentAccountName });

                    // 当新增一个用户, 就给此用户 添加余额, 余额的数量 从 系统设置中 获取
                    const { amount: rewardAmount } = await new_account_reward.get();
                    await eos_account_biz.add_balance(
                        lowerAccountName, 
                        rewardAmount, 
                        "新账户返利", 
                        `account_name: ${lowerAccountName}, reward_amount: ${rewardAmount}, reward_time: ${format(new Date(), 'YYYY-MM-DD HH:mm:ss')}`
                    );
                }

                let account_refer = await account_refer_biz.get_by_account_name(lowerAccountName);
                if (!account_refer) {
                    await account_refer_biz.create({ "account_name": lowerAccountName, "refer_name": agentAccountName });
                }
            }
        }
    } catch (err) {
        logger.error(err, '同步 PK10 的账号和代理时 报错了')
    }
}

(async () => {
    let options = {
        uri: `${config.sync_pk_account_url}/account_refer/get_all`,
        json: true
    };

    await sync_refer(options);

    setInterval(async () => {
        await sync_refer(options);
    }, 10 * 1000);
})();