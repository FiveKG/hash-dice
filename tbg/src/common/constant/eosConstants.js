// @ts-check

// 投资额度
const BASE_AMOUNT = "0.0001";
const WALLET_RECEIVER = "yujinsheng11";
const DISPENSE_ACCOUNT = "yujinsheng11";
const EOS_TOKEN = "eosio.token";
const TBG_TOKEN = "yujinsheng11"
const SCATTER_NET = "https://nodes.get-scatter.com"
const PRIVATE_KEY_TEST = "5KVL23nv9LGjChq8zqHv86ETcZ2FV68DHrniSBdXxMwmTF5ZusW"

/**
 * @type { Constant }
 */
const CONSTANT = {
    "BASE_AMOUNT": BASE_AMOUNT,
    "WALLET_RECEIVER": WALLET_RECEIVER,
    "DISPENSE_ACCOUNT": DISPENSE_ACCOUNT,
    "EOS_TOKEN": EOS_TOKEN,
    "TBG_TOKEN": TBG_TOKEN,
    "SCATTER_NET": SCATTER_NET,
    "PRIVATE_KEY_TEST": PRIVATE_KEY_TEST
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
 * @property { String } SCATTER_NET scatter 节点
 * @property { String } PRIVATE_KEY_TEST
 */