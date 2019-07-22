#!/bin/bash
#Description: test account api

# 我的团队 直接推荐
function showInvite() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/team/invite?account_name=${ac}
    done
}

# 我的团队 三三排位
function showMode() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/team/mode?account_name=${ac}
    done
}

# 我的团队 一条公排
function showSort() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/team/sort?account_name=${ac}
    done
}

# 点击收取收益
function gainIncome() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/team/invite -H "Content-Type: application/json" -d '
        {
            "account_name": "'${ac}'",
            "income_type": "all"
        }
        '
    done
}

# 我的团队 直接推荐
showInvite

# 我的团队 三三排位
# showMode

# 我的团队 一条公排
# showSort

# 点击收取收益
# gainIncome