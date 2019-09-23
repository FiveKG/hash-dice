// @ts-check
const logger = require("@fjhb/logger").child({"@":"get_balance"});
const eos_accountBiz = require("@fjhb/db-op").eos_account;
const account_refer_biz = require("@fjhb/db-op").account_refer;
const { get_status } = require("../../common");

// 添加用户推荐人
async function get_account_refer(req, res, next) {
    try {
        
        let eos_account_list = await eos_accountBiz.get_all_account();
        
        let res_data = [];
        for (let item of eos_account_list) {
            let account_refer_list = await account_refer_biz.get_all_referrer(item.account_name);
            res_data.push({
                "account_name": item.account_name,
                "account_refer_list": account_refer_list.map( it => { return it.account_name; })
            });
        }

        return res.send(get_status(1, res_data));
    } catch (error) {
        logger.error(error, "find eos_account error");
        next(error);
    }
};

module.exports = get_account_refer;