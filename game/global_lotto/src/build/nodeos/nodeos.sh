#!/bin/bash
#Description: create eos acount and issue token

shopt -s expand_aliases
# 钱包密码应为使用时的那个密码
UE_NET_POINT=""
POG_NET_POINT="http://45.251.109.187:8888"
LOCAL_NET_POINT="http://localhost:8888"
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5J6pxhZNj2GZMLc77eMkYpEWxp6ReZwQmPrS7g7ty7nLiiup2Vn'
alias cleos='docker exec -it nodeos /usr/bin/cleos --url=${POG_NET_POINT} --wallet-url unix:///root/eosio-wallet/keosd.sock'
ACCOUNT_LIST=(globallotto lottobanker eoscentereos eoslottoeos)
GLOBAL_CONTRACT_ACCOUNT=${ACCOUNT_LIST[0]}
cleos get info

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

# 先解锁钱包
unlock
# 生成一批测试账号，同时导入私钥
# blukImportKey

cleos create account yujinsheng11 globallotto EOS5mEtr1zTHnLDSe1sYpnNAX5pNbFsFM588dre5NLPpJT2Na9shy EOS5mEtr1zTHnLDSe1sYpnNAX5pNbFsFM588dre5NLPpJT2Na9shy
cleos create account yujinsheng11 lottobanker EOS5FZAjPBWbi4swy1c2zopL4jBAoPPehsH7Ui1oTQLXGq1oBemdh EOS5FZAjPBWbi4swy1c2zopL4jBAoPPehsH7Ui1oTQLXGq1oBemdh
cleos create account yujinsheng11 eoscentereos EOS7QMXqFuZt2K47ncd3BV6Ymayo9zNWhQDHkf1xzD8gMnSuspZog EOS7QMXqFuZt2K47ncd3BV6Ymayo9zNWhQDHkf1xzD8gMnSuspZog
cleos create account yujinsheng11 eoslottoeos EOS83Zqzp7wDPwzV2K4JLehJYvnREySbYEmmzPxjRpBbhzUC6tzhm EOS83Zqzp7wDPwzV2K4JLehJYvnREySbYEmmzPxjRpBbhzUC6tzhm
cleos create account yujinsheng11 eoshashdice EOS8jwfkPaaTLQq8rvbym2GHP18gt5c9VLS6JrMXeDz75TB12x6DN EOS8jwfkPaaTLQq8rvbym2GHP18gt5c9VLS6JrMXeDz75TB12x6DN
cleos create account yujinsheng11 dicebanker EOS7T7LMhXzi5wgLysv15PBWuVJNrf4p9ZHUoJVsLA741nHbmBFjd EOS7T7LMhXzi5wgLysv15PBWuVJNrf4p9ZHUoJVsLA741nHbmBFjd
cleos create account yujinsheng11 eossnatcheos EOS86dLiUP1zcWjDHQBazfxknTtRBSd8CvEaERJyndNehmEcmdMQw EOS86dLiUP1zcWjDHQBazfxknTtRBSd8CvEaERJyndNehmEcmdMQw
cleos create account yujinsheng11 snatchbanker EOS5DSEfWxRdrWJ3yaAqYZtAfejERtXxFBpb5oUo8pk2EyPHAKHMV EOS5DSEfWxRdrWJ3yaAqYZtAfejERtXxFBpb5oUo8pk2EyPHAKHMV

# 部署合约
cleos set contract $GLOBAL_CONTRACT_ACCOUNT ./globallotto -p $GLOBAL_CONTRACT_ACCOUNT 