// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/common/config" });
const { get_status } = require("../../common");
const sysConfig = require("../../common/sysConfig.js");
// console.debug("sysConfig: ", sysConfig);

async function getConfig(req, res, next){
    try {
        console.debug("sysConfig.bonus_config.get(): ", await sysConfig.bonus_config.get())
        const [
            eos_connect_info,
            collection_account,
            transfer_account,
            publish_symbol_account,
            { clubBonus }
        ] = await Promise.all([
            sysConfig.apiEosConnectInfo.get(),
            sysConfig.collectionAccount.get(),
            sysConfig.transferAccount.get(),
            sysConfig.publish_symbol_account.get(),
            sysConfig.bonus_config.get()
        ]);

        let res_config = {
            "chain_info":{
                "http_end_point": eos_connect_info.httpEndpoint,
                "chain_id"     : eos_connect_info.chainId
            },
            "collection_account": collection_account.accountName,
            "eosAccountName": process.env.NODE_ENV === "production" ? "eosio.token" : transfer_account.accountName,
            "symbolAccountName": publish_symbol_account.accountName,
            "club_bonus": clubBonus.rankRate
        }
        
        res.send(get_status(1, res_config));
    } catch (err) {
        logger.error(err, "get config error");
        next(err);
    }
}

module.exports = getConfig;