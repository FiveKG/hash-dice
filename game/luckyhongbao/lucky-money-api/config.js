// @ts-check

module.exports = {
    "contractAccountName": {
      "production": {
        "eosAccountName": "eosio.token",
        "hgbAccountName": "eosio.token"
      },
      "development": {
        "eosAccountName": "eosio.token",
        "hgbAccountName": "eosio.token"
      }
    },
    "jwt_secret": "Cpj9cTX8aZEIIThCyT1jWG4D4xqGNGH9caZAG5SQ",
    "sync_pk_account_url": "http://172.8.220.212:8889",
    /**
     * 用户余额变动
     */
    "balance_change_type": {
      "grab_red_envelope"  : { "code": "grab_red_envelope",    "text": "抢红包" },
      "refund"             : { "code": "refund",               "text": "返还" },
      "pre_deduction"      : { "code": "pre_deduction",        "text": "余额抵押" },
      "pre_deduction_chain": { "code": "pre_deduction_chain",  "text": "代币抵押" },
      "recharge"           : { "code": "recharge",             "text": "充值" },
      "withdraw"           : { "code": "withdraw",             "text": "提现" },
      "scatter转账"           : { "code": "scatter转账",        "text": "scatter转账" },
      "抢到的金额"           : { "code": "抢到的金额",           "text": "抢到的金额" } ,
      "抵押退还"           : { "code": "抵押退还",               "text": "抵押退还" },
      "抵押"              : { "code": "抵押",                   "text": "抵押" },
      "推荐人返佣"            : { "code": "推荐人返佣",             "text": "推荐人返佣" }
    },
    "symbol": {
      "EOS": "UE"
    },
    "airdrop_type": {
      "max_grab"    : { "code": "max_grab",     "text": "抢到金额最大红包" },
      "grab"        : { "code": "grab",         "text": "抢到红包" },
      "refer"       : { "code": "refer",        "text": "推荐" },
      "club_creator": { "code": "club_creator", "text": "俱乐部创建者" },
    }
  };