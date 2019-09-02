#!/bin/bash
#Description: create eos acount and issue token

shopt -s expand_aliases
# 钱包密码应为使用时的那个密码
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5J6pxhZNj2GZMLc77eMkYpEWxp6ReZwQmPrS7g7ty7nLiiup2Vn'
alias cleos='docker exec -it nodeos /usr/bin/cleos --url=http://localhost:8888 --wallet-url unix:///root/eosio-wallet/keosd.sock'
ACCOUNT_LIST=(tbgtokencoin uetokencoin tbgfreepool tbgminepool tbgjoin tshincome pshincome)
UE_TOKEN_ACCOUNT=${ACCOUNT_LIST[1]}
TBG_TOKEN_ACCOUNT=${ACCOUNT_LIST[0]}
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin setconfig '["uetokencoin", 0, 0]' -p tbgtokencoin
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin setconfig '["tbgfreepool", 0, 0]' -p tbgtokencoin
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin setconfig '["tbgminepool", 0, 0]' -p tbgtokencoin
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin setconfig '["tbgjoin", 0, 0]' -p tbgtokencoin
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin setconfig '["tshincome", 0, 0]' -p tbgtokencoin
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin setconfig '["pshincome", 0, 0]' -p tbgtokencoin


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
                # printf "private: $line\n" >> keys
                # 导入私钥
                # cleos wallet import --private-key=$line
                echo " "
            else
                # printf "public: $line\n" >> keys
                # printf "accountName: $accountName\n" >> keys
                # 创建账号
                cleos --url=http://45.251.109.187:8888 create account yujinsheng11 ${accountName} ${line} ${line}
            fi
            count=$(($count + 1))
        done
    done
}

# 部署代币合约
function setUEContract() {
    # 部署 UE 代币合约
    cleos --url=http://45.251.109.187:8888 set contract $1 ./eosio.token -p $1
    # 创建代币
    maximum_supply='1000000000.0000 UE'
    cleos --url=http://45.251.109.187:8888 push action $1 create "[\"$1\",\"${maximum_supply}\"]" -p $1
    # 发布代币
    cleos --url=http://45.251.109.187:8888 push action $1 issue "[\"$1\",\"${maximum_supply}\",\"issue\"]" -p $1
    # 智能合约完整调用格式，上两条为简写格式
    # cleos push action $1 create "{\"issuer\":\"$1\",\"maximum_supply\":\"${maximum_supply}\"}" -p $1
    # cleos push action $1 issue "{\"to\":\"${recevicer}\",\"quantity\":\"${maximum_supply}\",\"memo\":\"issue\"}" -p $1
}

# 部署 UE 代币合约
function setTBGContract() {
    cleos --url=http://45.251.109.187:8888 set contract $1 ./tbg/eosio.token -p $1
    # 创建代币
    maximum_supply='1000000000.0000 TBG'
    cleos --url=http://45.251.109.187:8888 push action $1 create "[\"$1\",\"${maximum_supply}\"]" -p $1
    # 发布代币
    cleos --url=http://45.251.109.187:8888 push action $1 issue "[\"$1\",\"${maximum_supply}\",\"issue\"]" -p $1
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
            cleos --url=http://45.251.109.187:8888 push action $1 setconfig "[\"${accountName}\",0,0]" -p $1
        fi
    done
}

# 先解锁钱包
unlock
# 生成一批测试账号，同时导入私钥
# blukImportKey

setUEContract $UE_TOKEN_ACCOUNT

cleos --url=http://45.251.109.187:8888 set contract uetokencoin ./eosio.token -p uetokencoin
# 创建代币
maximum_supply='1000000000.0000 UE'
cleos --url=http://45.251.109.187:8888 push action uetokencoin create '["uetokencoin","1000000000.0000 UE"]' -p uetokencoin
# 发布代币
cleos --url=http://45.251.109.187:8888 push action uetokencoin issue '["uetokencoin","1000000000.0000 UE","issue"]' -p uetokencoin

cleos --url=http://45.251.109.187:8888 set contract tbgtokencoin ./tbg/eosio.token -ptbgtokencoin
# 创建代币
maximum_supply="1000000000.0000 TBG"
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin create '["tbgtokencoin","1000000000.0000 TBG"]' -p tbgtokencoin
# 发布代币
cleos --url=http://45.251.109.187:8888 push action tbgtokencoin issue '["tbgtokencoin","1000000000.0000 TBG","issue"]' -p tbgtokencoin
setTBGContract $TBG_TOKEN_ACCOUNT