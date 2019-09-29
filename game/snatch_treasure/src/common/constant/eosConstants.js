// @ts-check

// 投资额度
// EOS token 合约账户
const EOS_TOKEN = "eosio.token";
const EOS_TOKEN_SYMBOL = "EOS"
// UE token 合约账户
const UE_TOKEN = "uetokencoin";
const UE_TOKEN_SYMBOL = "UE"
// TBG token 合约账户
const TBG_TOKEN = "tbgtokencoin"
const TBG_TOKEN_SYMBOL = "TBG"

// 庄家
const BANKER = "snatchbanker"

// 代投注账号，除全球彩外，所有游戏的代投帐号
const AGENT_ACCOUNT = "eosbankereos"

// 夺宝合约帐号
const SNATCH_TREASURE_CONTRACT = "eossnatcheos";
// 分发中心收益账号
const DISTRIBUTION_CENTER_ACCOUNT = "eoscentereos";
// 钱包收款帐号
const TBG_WALLET_RECEIVER = 'tbgreceiver'

// 节点信息
const END_POINT = "http://45.251.109.187:8888"
// const END_POINT = "http://192.168.1.141:8888"
// 私钥
const PRIVATE_KEY_TEST = "5J3QDbiCJDFpqxWwZ2jBdjwktn1LGV1T4JjaYiPwG4P3hCHjfyx,5K1HYKMacELeKM3Rcz2HNDLZpVXmBthHM6nxJroQfJgwy9yHzgz,5JbV632hRiMrqy39pK1ZFEFqgMFMH8gfkcX9ETPEmsXRGZCd7ma,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG,5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h,5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG"

// 区块链 id
const CHAIN_ID = "483c1c3c33ceaf2bd2264c2266807938addfe471ace2f7accda713d8c39b699d";

const JWT_SECRET = "Cpj9cTX8aZEIIThCyT1jWG4D4xqGNGH9caZAG5SQ";

/**
 * @type { Constant }
 */
const CONSTANT = {
    "EOS_TOKEN": EOS_TOKEN,
    "TBG_TOKEN": TBG_TOKEN,
    "UE_TOKEN": UE_TOKEN,
    "END_POINT": END_POINT,
    "PRIVATE_KEY_TEST": PRIVATE_KEY_TEST,
    "EOS_TOKEN_SYMBOL": EOS_TOKEN_SYMBOL,
    "UE_TOKEN_SYMBOL": UE_TOKEN_SYMBOL,
    "TBG_TOKEN_SYMBOL": TBG_TOKEN_SYMBOL,
    "SNATCH_TREASURE_CONTRACT": SNATCH_TREASURE_CONTRACT,
    "BANKER": BANKER,
    "AGENT_ACCOUNT": AGENT_ACCOUNT,
    "DISTRIBUTION_CENTER_ACCOUNT": DISTRIBUTION_CENTER_ACCOUNT,
    "TBG_WALLET_RECEIVER": TBG_WALLET_RECEIVER,
    "JWT_SECRET": JWT_SECRET,
    "CHAIN_ID": CHAIN_ID
}

module.exports = CONSTANT

/**
 * @description 
 * @typedef { Object } Constant
 * @property { String } EOS_TOKEN EOS 代币合约帐号 eosio.token
 * @property { String } TBG_TOKEN TBG 代币合约帐号
 * @property { String } END_POINT scatter 节点
 * @property { String } PRIVATE_KEY_TEST 私钥
 * @property { string } UE_TOKEN UE 代币合约帐号
 * @property { String } EOS_TOKEN_SYMBOL EOS 代币符号
 * @property { String } UE_TOKEN_SYMBOL UE 代币符号
 * @property { string } TBG_TOKEN_SYMBOL TBG 代币符号
 * @property { string } SNATCH_TREASURE_CONTRACT 夺宝合约帐号
 * @property { string } BANKER 庄家
 * @property { string } AGENT_ACCOUNT 代投注账号
 * @property { string } DISTRIBUTION_CENTER_ACCOUNT 分发中心收益账号
 * @property { string } TBG_WALLET_RECEIVER 钱包收款帐号
 * @property { string } TBG_WALLET_RECEIVER 钱包收款帐号
 * @property { string } JWT_SECRET
 * @property { string } CHAIN_ID
 */