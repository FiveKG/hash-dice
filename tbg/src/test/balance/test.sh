#!/bin/bash
#Description: test account api

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
        curl -XGET http://localhost:9527/account/invest_code -H "Content-Type: application/json" -d '
        {
            "account_name": "'${ac}'"
        }
        '
    done
}

# 帐号是否激活
function isActivated() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/is_activated -H "Content-Type: application/json" -d '
        {
            "account_name": "'${ac}'"
        }
        '
    done
}

# 帐号是否已经绑定
function isBind() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/account/is_bind -H "Content-Type: application/json" -d '
        {
            "account_name": "'${ac}'",
            "refer_code": "000000"
        }
        '
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