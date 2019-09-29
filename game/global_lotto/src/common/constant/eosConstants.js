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
const BANKER = "lottobanker"

// 分发中心收益账号
const DISTRIBUTION_CENTER_ACCOUNT = "eoscentereos"

// 代投注账号
const AGENT_ACCOUNT = "eoslottoeos"

// 全球彩合约帐号
const GLOBAL_LOTTO_CONTRACT = "globallotto";

const GLOBAL_LOTTO_BOTTOM_ACCOUNT = "lottobottom";
const GLOBAL_LOTTO_RESERVE_ACCOUNT = "lottoreserve";

// 钱包收款帐号
const TBG_WALLET_RECEIVER = 'tbgreceiver';

// 节点信息
const END_POINT = "http://45.251.109.187:8888"
// const END_POINT = "http://192.168.1.141:8888"
// 私钥
const PRIVATE_KEY_TEST = "5JaS6SpozjBr3dipLhGKHxLvxfd1NF8irkzciFD4ByEKsxHhA18,5JqHq1EgRUX1sdizAzd2WQHmnRGemBQapCxYRGUBy6Te5WcFXQa,5KNrMrmiQ1fu3cwMdRCdh1bAfBcbyte2nJwB6evcB1By3fmwF6s,5KN7eEYR6xqCARDDCDRKNbqdL4q6oW24hK22qGvrRWiWbje41tB,5JXK3gnpUiLvnbxLbcHDTbgKHfVGNJTyVUkfWFGYJZ6Ucihj2sB,5JfAs6FQZ6pjr82BExuSBYUQMJR86bppEtWUcujMKGbv4BQ4BCn,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG,5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h,5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG"


const JWT_SECRET = "Cpj9cTX8aZEIIThCyT1jWG4D4xqGNGH9caZAG5SQ";

// 区块链 id
const CHAIN_ID = "483c1c3c33ceaf2bd2264c2266807938addfe471ace2f7accda713d8c39b699d";

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
    "GLOBAL_LOTTO_CONTRACT": GLOBAL_LOTTO_CONTRACT,
    "BANKER": BANKER,
    "AGENT_ACCOUNT": AGENT_ACCOUNT,
    "DISTRIBUTION_CENTER_ACCOUNT": DISTRIBUTION_CENTER_ACCOUNT,
    "TBG_WALLET_RECEIVER": TBG_WALLET_RECEIVER,
    "GLOBAL_LOTTO_BOTTOM_ACCOUNT": GLOBAL_LOTTO_BOTTOM_ACCOUNT,
    "GLOBAL_LOTTO_RESERVE_ACCOUNT": GLOBAL_LOTTO_RESERVE_ACCOUNT,
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
 * @property { string } GLOBAL_LOTTO_CONTRACT 全球彩合约帐号
 * @property { string } BANKER 庄家
 * @property { string } AGENT_ACCOUNT 代投注账号
 * @property { string } DISTRIBUTION_CENTER_ACCOUNT 分发中心收益账号
 * @property { string } TBG_WALLET_RECEIVER 钱包收款帐号
 * @property { string } GLOBAL_LOTTO_BOTTOM_ACCOUNT 底池帐号
 * @property { string } GLOBAL_LOTTO_RESERVE_ACCOUNT 储备池帐号
 * @property { string } JWT_SECRET 
 * @property { string } CHAIN_ID 
 */