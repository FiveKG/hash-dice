#!/bin/bash
#Description: test account api
shopt -s expand_aliases
POG_NET_POINT="http://45.251.109.187:8888"
LOCAL_NET_POINT="http://localhost:8888"
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5J6pxhZNj2GZMLc77eMkYpEWxp6ReZwQmPrS7g7ty7nLiiup2Vn'
alias cleos='docker exec -it nodeos /usr/bin/cleos --url=${LOCAL_NET_POINT} --wallet-url unix:///root/eosio-wallet/keosd.sock'
WALLET_RECEIVER=tbgjoin
UE_TOKEN_ACCOUNT=uetokencoin

# 根据填写的邀请码显示出帐号名称
function showInviteCode() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/show_account_name_by_code?account_name=${ac}&refer_code=000000
    done
}

# 获取用户的邀请码
function getAccountInvestCode() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/invest_code?account_name=${ac} >> investCode.res
    done
}

# 帐号是否激活
function isActivated() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/is_activated?account_name=${ac}
    done
}

# 帐号是否已经绑定
function isBind() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/is_bind?account_name=${ac}
    done
}

# 绑定推荐关系
function bindReferrer() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        # echo '{"account_name":"'${ac}'","refer_code":"000000"}'
        curl -XPOST http://localhost:9527/account/bind_referrer -H "Content-Type: application/json" -d '{
            "account_name":"'${ac}'",
            "refer_code":"000000"
        }'
    done
}

# 转账给收款人，自己投资
function transfer() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        echo $count
        unset quantity
        unset recevicer
        unset memo
        unset symbol
        unset amount
        amount="100.0000"
        symbol="UE"
        quantity="${amount} ${symbol}"
        recevicer=$WALLET_RECEIVER
        memo=tbg_invest:${ac}
        cleos push action $UE_TOKEN_ACCOUNT transfer "[\"${ac}\",\"${WALLET_RECEIVER}\",\"${quantity}\",\"${memo}\"]" -p ${ac}
    done
}

# 用户等级
function userLevel() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/level?account_name=${ac}
    done
}

# 投资首页信息
function investmentIndexPage() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/investment_index?account_name=${ac}
    done
}

# 子帐号
function subAccount() {
    accountList=$(grep -o '[0-5a-z\.]\{12,\}' ../keyPairs)
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/sub_account?account_name=${ac}
    done
}

# 添加全球合伙人
function addGlobal() {
    curl -XPOST http://localhost:9527/account/bind_referrer -H 'Content-Type: application/json' -d '
    {
        "account_name": "gametestuser",
        "refer_code": "W00000"
    }'

    curl -XPOST http://localhost:9527/account/bind_referrer -H 'Content-Type: application/json' -d '
    {
        "account_name": "yujinsheng11",
        "refer_code": "W00000"
    }'
}

unlock
# 绑定账号信息
addGlobal
# bindReferrer

# 转账给收款人，参与 TBG-I
# transfer

# 获取用户的邀请码
# getAccountInvestCode

# 帐号是否激活
# isActivated

# 帐号是否已经绑定
# isBind

# 用户等级
# userLevel

# 投资首页信息
# investmentIndexPage

# 子帐号
# subAccount