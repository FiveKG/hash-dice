//@ts-check
var sysConfig = require("@fjhb/sys_config")("redis");

// 分发中心收益账号
const DISTRIBUTION_CENTER_ACCOUNT = "eoscentereos";
const DISTRIBUTION_CENTER_ACCOUNT_RATE = 1.2;
// 0.5% 拨入 TBG 股东分红池；
const ALLOC_TO_TSH_POOL = 0.5;
// 0.5% 拨入 TBG 三倍收益保障池；
const ALLOC_TO_PROTECTION_POOL = 0.5;
// 2% 拨入 TBG 共享推荐佣金分配；
const ALLOC_TO_REFERRER = 2;
// 0.6% TSH投资股东收益
const ALLOC_TO_TSH_INCOME = 0.6;
// 第三方游戏开发团队
const THIRD_PARTY_RATE = 0.2;
// 第三方游戏开发团队	游戏方账号
const THIRD_PARTY_ACCOUNT = DISTRIBUTION_CENTER_ACCOUNT;
// 拨入 TBG 钱包
const TBG_WALLET_RECEIVER_RATE = 3.6;
// 代投注账号，除全球彩外，所有游戏的代投帐号
const AGENT_ACCOUNT = "eosbankereos"
const AGENT_ACCOUNT_PRIVATE_KEY = "5J3QDbiCJDFpqxWwZ2jBdjwktn1LGV1T4JjaYiPwG4P3hCHjfyx";
const TBG_WALLET_RECEIVER = 'tbgreceiver'

;( async ()=> {

    try {
        if (!await sysConfig.apiEosConnectInfo.get()) {
            console.debug(`apiEosConnectInfo`);
            await sysConfig.apiEosConnectInfo.set({
                "chainId": "483c1c3c33ceaf2bd2264c2266807938addfe471ace2f7accda713d8c39b699d", 
                "httpEndpoint": "http://45.251.109.187:8888"
            });
        }
        if (!await sysConfig.codeEosConnectInfo.get()) {
            console.debug(`codeEosConnectInfo`);
            await sysConfig.codeEosConnectInfo.set({
                "chainId": "483c1c3c33ceaf2bd2264c2266807938addfe471ace2f7accda713d8c39b699d", 
                "httpEndpoint": "http://45.251.109.187:8888" 
            });
        }
        if (!await sysConfig.collectionAccount.get()) {
            console.debug(`collectionAccount`);
            await sysConfig.collectionAccount.set({
                "accountName" : "luckyhongbao"
            });
        }
        if (!await sysConfig.gameAdminAccount.get()) {
            console.debug(`collectionAccount`);
            await sysConfig.gameAdminAccount.set({
                "accountName": "luckyhongbao", 
                "privateKey": "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo"
            });
        }
        if (!await sysConfig.transferAccount.get()) {
            console.debug(`transferAccount`);
            await sysConfig.transferAccount.set({
                "accountName": "luckyhongbao", 
                "privateKey": "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo",
                "agent_account": AGENT_ACCOUNT,
                "agent_account_private_key": AGENT_ACCOUNT_PRIVATE_KEY
            });
        }

        if (!await sysConfig.red_packet_allocation.get()) {
            console.debug(`red_packet_allocation`);
            //#region 设置红包分配比例
            // 95.00%	所有抢得红包的玩家	玩家账号
            // 0.20%	第三方游戏开发团队	游戏方账号
            // 1.20%	游戏分发	分发收益账号
            // 3.60%	TBG钱包	钱包账号
            let red_packet_allocation = { 
                "bonusPoolRate": 0.5 , //0
                "redEnvelopRate": 95 ,//97
                "reservedPart" : {
                    "officialClubSystem" : 4.5,//3
                    "noRefComRefClub":{  "ownerRate":2.5,  "systemRate": 2 },// 1, 2
                    "refCommonClub":{  "ownerRate": 3.5, "systemRate": 1 }   // 1, 2
                },
                "distribution_center_account": DISTRIBUTION_CENTER_ACCOUNT,
                "distribution_center_account_rate": DISTRIBUTION_CENTER_ACCOUNT_RATE,
                "alloc_to_tsh_pool": ALLOC_TO_TSH_POOL,
                "alloc_to_protection_pool": ALLOC_TO_PROTECTION_POOL,
                "third_party_rate": THIRD_PARTY_RATE,
                "third_party_account": THIRD_PARTY_ACCOUNT,
                "alloc_to_referrer": ALLOC_TO_REFERRER,
                "alloc_to_tsh_income": ALLOC_TO_TSH_INCOME,
                "tbg_wallet_receiver": TBG_WALLET_RECEIVER,
                "tbg_wallet_receiver_rate": TBG_WALLET_RECEIVER_RATE
            }
            await sysConfig.red_packet_allocation.set(red_packet_allocation);        
            //#endregion
        }

        if (!await sysConfig.coin_air_drop_config.get()) {
            console.debug(`coin_air_drop_config`);
            //#region 空投的配置
            let coinAirDrop = { 
                "officialClub" : {
                    "maxGrabUser"         : { "symbol": "CLUB" ,  "rate": 10 } ,
                    "otherUser"           : { "symbol": "CLUB" ,  "rate": 1 } ,
                    "referUser"           : { "symbol": "CLUB" ,  "rate": 1 }
                },
                "commonClub" : {
                    "clubOwner":{ "symbol": "CLUB" ,  "rate": 1 }
                }
            }
            await sysConfig.coin_air_drop_config.set(coinAirDrop);
            //#endregion
        }

        if (!await sysConfig.publish_symbol_account.get()) {
            console.debug(`publish_symbol_account`);
            const publishSymbolAccount = {
                "accountName": "eosio.token", 
                "privateKey": "5JR6dFXSR8YsckYtQhH2TD3CnM5DJAYozbiB82T9a9rARnsubxC"
            };

            await sysConfig.publish_symbol_account.set(publishSymbolAccount);
        }


        if (!await sysConfig.bonus_config.get()) {
            console.debug(`bonus_config`);
            await sysConfig.bonus_config.set({
                "clubBonus": {
                    "totalRate": 20,
                    "rankRate": [10, 5, 3, 1.5, 0.5]
                },
                "symbolBonus": {
                    "totalRate": 50
                }
            })
        }

    } catch (error) {
        console.error(error);
    }

    console.log(`over`);
    process.exit();

})();



