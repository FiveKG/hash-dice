`luckymoney.club`

### run docker container
```
docker run -dt --name nodeos --publish 8888:8888 --publish 5555:5555 --volume /home/yujinsheng/.eosio/nodeos:/eosio -w /eosio eostudio/eos:v1.8.0 /bin/bash
```

### start nodeos and keosd
```
docker exec -it -w /eosio nodeos /bin/bash -c "keosd --http-server-address=0.0.0.0:5555 & nodeos -e -p eosio --plugin eosio::http_plugin --plugin eosio::chain_plugin --plugin eosio::chain_api_plugin --plugin eosio::producer_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --replay-blockchain --data-dir /eosio/data --config-dir /eosio/config --http-server-address=0.0.0.0:8888 --access-control-allow-origin=* --http-validate-host=false --max-transaction-time=200 --disable-replay-opts --contracts-console --filter-on=*"
```

### connect to docker container 
```
docker exec -it nodeos /bin/bash
root@9270b9e8849b:/eosio#
```

#### create wallet
```
root@9270b9e8849b:/eosio# cleos wallet create --to-console
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5J6pxhZNj2GZMLc77eMkYpEWxp6ReZwQmPrS7g7ty7nLiiup2Vn"
```

#### unlock wallet and create keys
```
root@9270b9e8849b:/eosio# cleos wallet unlock
password: Unlocked: default
root@9270b9e8849b:/eosio# cleos wallet create_key
Created new private key with a public key of: "EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR"
```

#### import eosio key
* eosio private key: `5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3`
```
root@9270b9e8849b:/eosio# cleos wallet import
private key: imported private key for: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```

#### get keys pairs
* need wallet password
```
root@9270b9e8849b:/eosio# cleos wallet private_keys
password: [[
    "EOS63n3ZaYyGkPP7xRsztJz9roxKdJMG4Go4jvEmc4L27bRMZ3gHV",
    "5JR6dFXSR8YsckYtQhH2TD3CnM5DJAYozbiB82T9a9rARnsubxC"
  ],[
    "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
  ],[
    "EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR",
    "5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h"
  ],[
    "EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv",
    "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo"
  ],[
    "EOS5aicTbGvPj2WHEmcN26aAuR5E5PmYYgr4M34NFVr6Tgn9fiJoV",
    "5JyDaYmfCKEnBFRhfBWFPBzwQPfqrwwxr4eJHti58it6n86H7G2"
  ],[
    "EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw",
    "5HrqjhPdGVmiBRDPwNftkjGCr7Ddoz5bXF8rrzdwhmHxmFnALk4"
  ]
]
```

#### use key create account
* create test account
    * eosio.token yujinsheng11 globallotto lottobanker eoscentereos eoslottoeos
```
cleos create account eosio yujinsheng11 EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR
cleos create account eosio gametestuser EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv
```

### complier smart contract
```
docker run --name eosio_cdt -v /home/yujinsheng/tmp/yuezhi/eosio.contracts:/contracts -w /contracts -dt eostudio/eosio.cdt:v1.6.2
alias eosio-cpp='docker exec -it eosio_cdt /usr/bin/eosio-cpp'

eosio-cpp ./global_lotto/src/globallotto.cpp -I ./global_lotto/include -o ./global_lotto/globallotto.wasm --abigen
```

#### set smart contract
```
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5HrNm1UVh3RoaBZ1eCADLnvuJmFgwv1gEF4rv8uDAqgVzKJ8zbf'
alias cleos='docker exec -it nodeos /usr/bin/cleos -u http://localhost:8888 --wallet-url unix:///root/eosio-wallet/keosd.sock'
```

#### deploy `globallotto` smart contract
```
yujinsheng@ubuntu:~$ docker exec -it nodeos /usr/bin/cleos -u http://localhost:8888 set contract luckyhongbao ./luckymoney -p luckyhongbao
Reading WASM from /eosio/luckymoney/luckymoney.wasm...
Publishing contract...
executed transaction: ac16b9c2a5f975c7b583f8384548edc01574f5bb53fe7784948e893c3c08c715  7656 bytes  144496 us
#         eosio <= eosio::setcode               {"account":"luckyhongbao","vmtype":0,"vmversion":0,"code":"0061736d0100000001cd012060000060057f7e7f7...
#         eosio <= eosio::setabi                {"account":"luckyhongbao","abi":"0e656f73696f3a3a6162692f312e31000505636c6561720002036b65790675696e7...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```
