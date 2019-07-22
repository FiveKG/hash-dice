#!/bin/bash
#Description: test account api
shopt -s expand_aliases
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5JiEbjX8fCMuHCw86jGdg9goPrx7rC5ejNxTjgh3E1v3EV2pTcP'
alias cleos='docker exec -it nodeos /usr/bin/cleos -u http://localhost:8888 --wallet-url unix:///root/eosio-wallet/keosd.sock'
UE_TOKEN_ACCOUNT=eosio.token

# 根据填写的邀请码显示出帐号名称
function showInviteCode() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/show_account_name_by_code -H "Content-Type: application/json" -d '
        {
            "account_name": "'${ac}'",
            "refer_code": "000000"
        }
        '
    done
}

# 获取用户的邀请码
function getAccountInvestCode() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/invest_code?account_name=${ac} >> investCode.res
    done
}

# 帐号是否激活
function isActivated() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/is_activated?account_name=${ac}
    done
}

# 帐号是否已经绑定
function isBind() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/is_bind?account_name=${ac}
    done
}

# 绑定推荐关系
function bindReferrer() {
    accountList=$(grep "accountName" ./keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XPOST http://localhost:9527/account/bind_referrer -H "Content-Type: application/json" -d '
        {
            "account_name": "'${ac}'",
            "refer_code": "000000"
        }
        '
    done
}

# 转账给收款人，自己投资
function transfer() {
    accountList=$(grep "accountName" ./keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        unset quantity
        unset recevicer
        unset memo
        unset symbol
        unset amount
        amount="100.0000"
        symbol="UE"
        quantity="${amount} ${symbol}"
        recevicer="uegametoken"
        memo=tbg_invest:${ac}
        cleos push action eosio.token transfer "{\"from\":\"${ac}\",\"to\":\"${recevicer}\",\"quantity\":\"${quantity}\",\"memo\":\"${memo}\"}" -p ${ac}
    done
}

# 用户等级
function userLevel() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/level?account_name=${ac}
    done
}

# 投资首页信息
function investmentIndexPage() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/investment_index?account_name=${ac}
    done
}

# 子帐号
function subAccount() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/sub_account?account_name=${ac}
    done
}


# unlock
# 绑定账号信息
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