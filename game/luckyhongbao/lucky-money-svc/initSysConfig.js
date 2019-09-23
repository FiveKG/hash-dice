//@ts-check
var sysConfig = require("@fjhb/sys_config")("redis");

( async ()=> {

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
                "privateKey": "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo"
            });
        }

        if (!await sysConfig.red_packet_allocation.get()) {
            console.debug(`red_packet_allocation`);
            //#region 设置红包分配比例
            let red_packet_allocation = { 
                "bonusPoolRate": 0.5 , //0
                "redEnvelopRate": 95 ,//97
                "reservedPart" : {
                    "officialClubSystem" : 4.5,//3
                    "noRefComRefClub":{  "ownerRate":2.5,  "systemRate": 2 },// 1, 2
                    "refCommonClub":{  "ownerRate": 3.5, "systemRate": 1 }   // 1, 2
                }
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



