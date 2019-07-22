#!/bin/bash
#Description: test account api

# 显示投资收益
function showIncomeDetail() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XGET http://localhost:9527/income/income_detail?account_name=${ac}
    done
}

# 点击收取收益
function gainIncome() {
    accountList=$(grep "accountName" ../keyPairs | awk '{print $2}')
    for ac in $accountList
    do
        # 发送请求到 tbg 服务
        curl -XPOST http://localhost:9527/income/income_gain -H "Content-Type: application/json" -d '
        {
            "account_name": "'${ac}'",
            "income_type": "all"
        }
        '
    done
}

# 显示投资收益
# showIncomeDetail

# 点击收取收益
gainIncome