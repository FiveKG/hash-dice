#!/bin/bash
#Description:  create key pairs
shopt -s expand_aliases
# 钱包密码应为使用时的那个密码
POG_NET_POINT="http://45.251.109.187:8888"
LOCAL_NET_POINT="http://localhost:8888"
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5J6pxhZNj2GZMLc77eMkYpEWxp6ReZwQmPrS7g7ty7nLiiup2Vn'
alias cleos='docker exec -it nodeos /usr/bin/cleos --url=${POG_NET_POINT} --wallet-url unix:///root/eosio-wallet/keosd.sock'
UE_TOKEN_ACCOUNT=uetokencoin

# 生成 EOS 账号
function genEosAccountName() {
    LENGTH=12
    EOS_NAME_CONVENTIONS_CHAR=(1 2 3 4 5 . a b c d e f g h i j k l m n o p q r s t u v w x y z)
    NUM_SEQ=${#EOS_NAME_CONVENTIONS_CHAR[@]}
    # printf "NUM_SEQ: $NUM_SEQ\n"
    i=1
    accountName=''
    flag=0
    while [ "$i" -le "$LENGTH" ]
    do
        # 随机取一个字符
        ACCOUNT_NAME[$i]=${EOS_NAME_CONVENTIONS_CHAR[$((RANDOM%NUM_SEQ))]}
        # ACCOUNT_NAME[1]=${EOS_NAME_CONVENTIONS_CHAR[5]}
        # 不以点和数字开头的账号
        if [[ ${ACCOUNT_NAME[1]} == "." ]] || [[ ${ACCOUNT_NAME[1]} == [[:digit:]] ]]
        then
            # printf "ACCOUNT_NAME[12]: ${ACCOUNT_NAME[12]}\n"
            unset ACCOUNT_NAME[12]
        # 最后一个符号不能为点
        elif [[ ${ACCOUNT_NAME[12]} == "." ]];
        then
            # printf "ACCOUNT_NAME[12]: ${ACCOUNT_NAME[12]}\n"
            unset ACCOUNT_NAME[12]
        else
            let "i=i+1"
        fi
    done
    # 将获取到的十二位字符数组连成字符串
    for j in "${ACCOUNT_NAME[@]}"
    do
        accountName=${accountName}${j}
    done
}

# 批量导入密钥
function blukImportKey() {
    unset q
    for q in $(seq 10)
    do
        unset count
        unset tmpStr
        unset accountName
        count=0
        genEosAccountName
        for line in `cleos create key --to-console | awk '{print $3}'`
        do
            if [ $count -eq 0 ]
            then
                # 将账号信息重定向到文件
                printf "private: $line\n" >> testkey
                # 导入私钥
                cleos wallet import --private-key=$line
                # echo ""
            else
                acc=$accountName
                printf "public: $line\n" >> testkey
                printf "accountName: $accountName\n" >> testkey
                # 创建账号
                cleos create account yujinsheng11 $accountName $line $line
                # 转帐
                quantity='10000.0000 UE'
                # echo "$quantity"
                cleos push action ${UE_TOKEN_ACCOUNT} transfer "[\"${UE_TOKEN_ACCOUNT}\",\"${acc}\",\"${quantity}\",\"recharger\"]" -p ${UE_TOKEN_ACCOUNT}
            fi
            count=$(($count + 1))
        done
    done
}

# 给测试账户充值
function recharger() {
    quantity='10000.0000 UE'
    for account in `grep -o '[0-5a-z\.]\{12,\}' testkey`
    do
        printf "$account\t"
        cleos push action ${UE_TOKEN_ACCOUNT} transfer "[\"${UE_TOKEN_ACCOUNT}\",\"${account}\",\"${quantity}\",\"recharger\"]" -p ${UE_TOKEN_ACCOUNT}
    done
}

# 先解锁钱包
unlock
# 生成一批测试账号，同时导入私钥
blukImportKey

# recharger

cleos -u http://45.251.109.187:8888 push action tbgtokencoin transfer '["tbgtokencoin","yujinsheng11","1000000.0000 TBG","recharger"]' -p tbgtokencoin
cleos -u http://45.251.109.187:8888  push action tbgtokencoin transfer '["tbgtokencoin","gametestuser","1000000.0000 TBG","recharger"]' -p tbgtokencoin

cleos -u http://45.251.109.187:8888 push action uetokencoin transfer '["uetokencoin","yujinsheng11","1000000.0000 UE","recharger"]' -p uetokencoin
cleos -u http://45.251.109.187:8888  push action uetokencoin transfer '["uetokencoin","gametestuser","1000000.0000 UE","recharger"]' -p uetokencoin



cleos -u http://45.251.109.187:8888 push action uetokencoin transfer '["yujinsheng11","tbgjoin","10.0000 UE","recharger"]' -p yujinsheng11
cleos -u http://45.251.109.187:8888 push action uetokencoin transfer '["yujinsheng11","tbgfreepool","10.0000 UE","recharger"]' -p yujinsheng11
cleos -u http://45.251.109.187:8888 push action uetokencoin transfer '["yujinsheng11","tbgfreepool","1000.0000 UE","recharger"]' -p yujinsheng11
cleos -u http://45.251.109.187:8888 push action tbgtokencoin transfer '["tbgtokencoin","tbgfreepool","100.0000 TBG","recharger"]' -p tbgtokencoin
