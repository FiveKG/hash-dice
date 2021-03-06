// @ts-check

// 投资额度
// 参与 TBG1 所需 UE 额度
const BASE_AMOUNT = "1000";
// TBG1 收款账户
const WALLET_RECEIVER = "tbgjoin";
// TBG1 出款账户
const DISPENSE_ACCOUNT = "tbgjoin";
// EOS token 合约账户
const EOS_TOKEN = "eosio.token";
const EOS_TOKEN_SYMBOL = "EOS"
// UE token 合约账户
const UE_TOKEN = "uetokencoin";
const UE_TOKEN_SYMBOL = "UE"
// TBG token 合约账户
const TBG_TOKEN = "tbgtokencoin"
const TBG_TOKEN_SYMBOL = "TBG"

const TBG_WALLET_RECEIVER = "tbgreceiver";

// 节点信息
const END_POINT = "http://45.251.109.187:8888"

// 私钥
const PRIVATE_KEY_TEST = "5J2GxxF4xCfAZjP9R26jwnVY8rp8FYqXRE1fJPq5KDMSxa5NRuW,5K3LFVo36rAYBuAGC1UQmrZtrtvLkuWVYQ6TyhzwBgB2DpHo4zB,5K56kFugCU8UwbREvaZ8DTnH45q1LCMCQwp6xRHTGmxZVpUxBtt,5Kd5ExHx2AZwcnfFsQwNuiMvbeZvk1WGBD1iyc4FjwT5WBmDEF6,5JrN9PmaBTuDuoDBhYPwVsBmjTwtdpeGg4LN1sTCzv8igZgtxrx,5JZH8pBYdr3yfZnDhPtZzu9437tRoUJVCny8DvtCx1kbBh6KqyW,5JSZgw2fuoeXLXzwoQyBJ3L9vwH7AoQxjwBQRar4G2jqXnfrSXW,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG,5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h,5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo,5KSzppBW7LcwVQ4hA1AQP4vZYWq1uEv4EQnZ5yz1eu41eLgrLK2,5JRiAXpyd5TW5REvLYd35FkrJSMjFfiUtrwrCNpChHFMVNnRDwB,5JAW6eWS4ADjwCr76xCvmPefknzhFg33f4haL5dbuiB5WoW79tQ,5JiaokGm1A7kyLq92YrQjp42Fr7Vqs52NBquCYiuU8DxKURkhfu,5KbQQbR83HFMPPaKCY4GPVBtNZZW4t6nNxtPEWkVPUHMWxpQLzS,5K7h5xxZNCfq6ujRmLWgCHHQKf4gAuKYAU8yDFRDwvkAN3scPki,5K5sRqqp3XebvjMmK1TYBFiSAd6XbwLeJa9L3CxWBMiWcSGCsDG"

// openssl rand -base64 32
const JWT_SECRET = "Cpj9cTX8aZEIIThCyT1jWG4D4xqGNGH9caZAG5SQ";

// 区块链 id
const CHAIN_ID = "483c1c3c33ceaf2bd2264c2266807938addfe471ace2f7accda713d8c39b699d";

/**
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_AMOUNT": BASE_AMOUNT,
    "WALLET_RECEIVER": WALLET_RECEIVER,
    "DISPENSE_ACCOUNT": DISPENSE_ACCOUNT,
    "EOS_TOKEN": EOS_TOKEN,
    "TBG_TOKEN": TBG_TOKEN,
    "UE_TOKEN": UE_TOKEN,
    "END_POINT": END_POINT,
    "PRIVATE_KEY_TEST": PRIVATE_KEY_TEST,
    "EOS_TOKEN_SYMBOL": EOS_TOKEN_SYMBOL,
    "UE_TOKEN_SYMBOL": UE_TOKEN_SYMBOL,
    "TBG_TOKEN_SYMBOL": TBG_TOKEN_SYMBOL,
    "TBG_WALLET_RECEIVER": TBG_WALLET_RECEIVER,
    "JWT_SECRET": JWT_SECRET,
    "CHAIN_ID": CHAIN_ID
}

module.exports = CONSTANT

/**
 * @description 
 * @typedef { Object } Constant
 * @property { String } BASE_AMOUNT 投资额度
 * @property { String } WALLET_RECEIVER 收款帐号
 * @property { String } DISPENSE_ACCOUNT 出款帐号
 * @property { String } EOS_TOKEN EOS 代币合约帐号 eosio.token
 * @property { String } TBG_TOKEN TBG 代币合约帐号
 * @property { String } END_POINT scatter 节点
 * @property { String } PRIVATE_KEY_TEST 私钥
 * @property { string } UE_TOKEN UE 代币合约帐号
 * @property { String } EOS_TOKEN_SYMBOL EOS 代币符号
 * @property { String } UE_TOKEN_SYMBOL UE 代币符号
 * @property { string } TBG_TOKEN_SYMBOL TBG 代币符号
 * @property { string } TBG_WALLET_RECEIVER 钱包收款帐号
 * @property { string } JWT_SECRET
 * @property { string } CHAIN_ID
 */