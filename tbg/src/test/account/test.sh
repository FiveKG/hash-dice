#!/bin/bash
#Description: test account api
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

# 绑定账号信息
addGlobal
bindReferrer

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