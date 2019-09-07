#!/bin/bash
#Description: create eos acount and issue token

shopt -s expand_aliases
# 钱包密码应为使用时的那个密码
UE_NET_POINT=""
POG_NET_POINT="http://45.251.109.187:8888"
LOCAL_NET_POINT="http://localhost:8888"
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5J6pxhZNj2GZMLc77eMkYpEWxp6ReZwQmPrS7g7ty7nLiiup2Vn'
alias cleos='docker exec -it nodeos /usr/bin/cleos --url=${POG_NET_POINT} --wallet-url unix:///root/eosio-wallet/keosd.sock'
ACCOUNT_LIST=(tbgtokencoin uetokencoin tbgfreepool tbgminepool tbgjoin tshincome pshincome)
UE_TOKEN_ACCOUNT=${ACCOUNT_LIST[1]}
TBG_TOKEN_ACCOUNT=${ACCOUNT_LIST[0]}

# cleos get info

# 批量生成并导入密钥
function blukImportKey() {
    unset acc
    # 遍历数组中的账号
    for acc in "${ACCOUNT_LIST[@]}";
    do
        unset count
        unset tmpStr
        unset accountName
        count=0
        accountName=$acc
        for line in `cleos create key --to-console | awk '{print $3}'`
        do
            if [ $count -eq 0 ]
            then
                # 将账号信息重定向到文件
                printf "private: $line\n" >> keys
                # 导入私钥
                cleos wallet import --private-key=$line
                echo " "
            else
                printf "public: $line\n" >> keys
                printf "accountName: $accountName\n" >> keys
                # 创建账号
                cleos create account yujinsheng11 ${accountName} ${line} ${line}
            fi
            count=$(($count + 1))
        done
    done
}

# 部署代币合约
function setUEContract() {
    # 部署 UE 代币合约
    cleos set contract $1 ./eosio.token -p $1
    # 创建代币
    maximum_supply='1000000000.0000 UE'
    cleos push action $1 create "[\"$1\",\"${maximum_supply}\"]" -p $1
    # 发布代币
    cleos push action $1 issue "[\"$1\",\"${maximum_supply}\",\"issue\"]" -p $1
    # 智能合约完整调用格式，上两条为简写格式
    # cleos push action $1 create "{\"issuer\":\"$1\",\"maximum_supply\":\"${maximum_supply}\"}" -p $1
    # cleos push action $1 issue "{\"to\":\"${recevicer}\",\"quantity\":\"${maximum_supply}\",\"memo\":\"issue\"}" -p $1
}

# 部署 UE 代币合约
function setTBGContract() {
    cleos set contract $1 ./tbg/eosio.token -p $1
    # 创建代币
    maximum_supply='1000000000.0000 TBG'
    cleos push action $1 create "[\"$1\",\"${maximum_supply}\"]" -p $1
    # 发布代币
    cleos push action $1 issue "[\"$1\",\"${maximum_supply}\",\"issue\"]" -p $1
    # 添加管理管理账户
    unset acc
    for acc in "${ACCOUNT_LIST[@]}";
    do
        unset count
        unset tmpStr
        unset accountName
        count=0
        accountName=$acc
        if [[ $accountName == ${ACCOUNT_LIST[0]} ]] || [[ $accountName == ${ACCOUNT_LIST[1]} ]]; then
            printf "$accountName\n"
            continue
        else
            cleos push action $1 setconfig "[\"${accountName}\",0,0]" -p $1
        fi
    done
}

# 先解锁钱包
# unlock
# 生成一批测试账号，同时导入私钥
# blukImportKey

# setUEContract $UE_TOKEN_ACCOUNT

# setTBGContract $TBG_TOKEN_ACCOUNT