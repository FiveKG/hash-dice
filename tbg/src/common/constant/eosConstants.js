// @ts-check

// 投资额度
// 参与 TBG1 所需 UE 额度
const BASE_AMOUNT = "100";
// TBG1 收款账户
const WALLET_RECEIVER = "uegametoken";
// TBG1 出款账户
const DISPENSE_ACCOUNT = "uegametoken";
// EOS token 合约账户
const EOS_TOKEN = "eosio.token";
const EOS_TOKEN_SYMBOL = "EOS"
// UE token 合约账户
const UE_TOKEN = "wallettoken";
const UE_TOKEN_SYMBOL = "UE"
// TBG token 合约账户
const TBG_TOKEN = "tbgametoken"
const TBG_TOKEN_SYMBOL = "TBG"

// 节点信息
const END_POINT = "http://localhost:8888"
// 私钥
const PRIVATE_KEY_TEST = "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo"

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
    "TBG_TOKEN_SYMBOL": TBG_TOKEN_SYMBOL
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
 * 
 */