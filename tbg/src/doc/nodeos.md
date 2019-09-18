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
    * eosio.token yujinsheng11 luckyhongbao test
```
echo -e "5JR6dFXSR8YsckYtQhH2TD3CnM5DJAYozbiB82T9a9rARnsubxC" | cleos wallet import
echo -e "5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h" | cleos wallet import
echo -e "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo" | cleos wallet import
echo -e "5JyDaYmfCKEnBFRhfBWFPBzwQPfqrwwxr4eJHti58it6n86H7G2" | cleos wallet import
echo -e "5HrqjhPdGVmiBRDPwNftkjGCr7Ddoz5bXF8rrzdwhmHxmFnALk4" | cleos wallet import
cleos create account eosio eosio.token EOS63n3ZaYyGkPP7xRsztJz9roxKdJMG4Go4jvEmc4L27bRMZ3gHV EOS63n3ZaYyGkPP7xRsztJz9roxKdJMG4Go4jvEmc4L27bRMZ3gHV
cleos create account eosio yujinsheng11 EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR
cleos create account eosio gametestuser EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv
cleos create account eosio tbgametoken EOS5aicTbGvPj2WHEmcN26aAuR5E5PmYYgr4M34NFVr6Tgn9fiJoV EOS5aicTbGvPj2WHEmcN26aAuR5E5PmYYgr4M34NFVr6Tgn9fiJoV
cleos create account eosio tbtestuser1 EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw
cleos create account eosio dengderong EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw

cleos set contract eosio.token ./eosio.token
cleos push action eosio.token create '["eosio.token", "1000000000.0000 EOS"]' -p eosio.token
cleos push action eosio.token issue '["eosio.token", "1000000000.0000 EOS", "issue"]' -p eosio.token
cleos set contract uegametoken ./eosio.token
cleos push action uegametoken create '["uegametoken", "1000000000.0000 UE"]' -p uegametoken
cleos push action uegametoken issue '["uegametoken", "1000000000.0000 UE", "issue"]' -p uegametoken
cleos set contract tbgametoken ./eosio.token
cleos push action tbgametoken create '["tbgametoken", "1000000000.0000 TBG"]' -p tbgametoken
cleos push action tbgametoken issue '["tbgametoken", "1000000000.0000 TBG", "issue"]' -p tbgametoken
cleos set contract gametestuser ./eosio.token
cleos push action gametestuser create '["gametestuser", "10000.0000 TEST"]' -p gametestuser
cleos push action gametestuser issue '["gametestuser", "10000.0000 TEST", "issue"]' -p gametestuser

root@9270b9e8849b:/eosio# cleos create account eosio eosio.token EOS63n3ZaYyGkPP7xRsztJz9roxKdJMG4Go4jvEmc4L27bRMZ3gHV EOS63n3ZaYyGkPP7xRsztJz9roxKdJMG4Go4jvEmc4L27bRMZ3gHV
executed transaction: 65dccc8711acdc0204ab0ced84e08f243194741434e947d93332977944bdc559  200 bytes  5628 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"eosio.token","owner":{"threshold":1,"keys":[{"key":"EOS63n3ZaYyGkPP7xRszt...
warning: transaction executed locally, but may not be confirmed by the network yet         ] 
root@9270b9e8849b:/eosio# cleos create account eosio yujinsheng11 EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR EOS6UtznEsEeFMytBUxhUZy5Bj6iFbhjMJk49xPeoLifDKve7MhyR
executed transaction: ebb693dda25c8f84b77d7af2d61b86eba235b431586ea17d4d066f9f58baf510  200 bytes  342 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"yujinsheng11","owner":{"threshold":1,"keys":[{"key":"EOS6UtznEsEeFMytBUxh...
warning: transaction executed locally, but may not be confirmed by the network yet         ] 
root@9270b9e8849b:/eosio# cleos create account eosio uegametoken EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv
executed transaction: c3873854b4dbc7146fff6c4aac7acda593f352e0a973af365f09d0f63ba76f81  200 bytes  150 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"uegametoken","owner":{"threshold":1,"keys":[{"key":"EOS6xKtqbXeTwnrwgVx7...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
root@50384787856d:/eosio/contracts# cleos create account eosio tbgametoken EOS5aicTbGvPj2WHEmcN26aAuR5E5PmYYgr4M34NFVr6Tgn9fiJoV EOS5aicTbGvPj2WHEmcN26aAuR5E5PmYYgr4M34NFVr6Tgn9fiJoV
executed transaction: e59b5674c887372a9be7787f0dd4f5515c3b4de2940581547f050c783bfeaeaf  200 bytes  221 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"tbgametoken","owner":{"threshold":1,"keys":[{"key":"EOS5aicTbGvPj2WHEmcN2...
warning: transaction executed locally, but may not be confirmed by the network yet         ] 
root@50384787856d:/eosio/contracts# cleos create account eosio gametestuser EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw
executed transaction: 3e554826920aedae6137b991d995ea3dbdf50d71ea2b18c6cb650446a056b326  200 bytes  331 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"gametestuser","owner":{"threshold":1,"keys":[{"key":"EOS8iGjedKoNxdHMacts...
warning: transaction executed locally, but may not be confirmed by the network yet         ] 
```

### complier smart contract
```
docker run --name eosio_cdt -v /home/yujinsheng/tmp/yuezhi/eosio.contracts:/contracts -w /contracts -dt eostudio/eosio.cdt:v1.6.2
alias eosio-cpp='docker exec -it eosio_cdt /usr/bin/eosio-cpp'

eosio-cpp ./hey.cpp -I include -o ./hey.wasm --abigen

eosio-cpp ./globallotto/src/globallotto.cpp -I ./globallotto/include -o ./globallotto/globallotto.wasm --abigen

eosio-cpp ./hashdice/src/hashdice.cpp -I ./hashdice/include -o ./hashdice/hashdice.wasm --abigen

eosio-cpp ./minlottery/src/minlottery.cpp -I ./minlottery/include -o ./minlottery/minlottery.wasm --abigen

eosio-cpp ./snatch/src/snatch.cpp -I ./snatch/include -o ./snatch/snatch.wasm --abigen
```

#### set smart contract
```
alias unlock='docker exec -it nodeos /usr/bin/cleos wallet unlock --password=PW5HrNm1UVh3RoaBZ1eCADLnvuJmFgwv1gEF4rv8uDAqgVzKJ8zbf'
alias cleos='docker exec -it nodeos /usr/bin/cleos -u http://localhost:8888 --wallet-url unix:///root/eosio-wallet/keosd.sock'
```

#### deploy `eosio.token` smart contract and create asset
* use `eosio.token` account issue;
```
yujinsheng@ubuntu:~$ docker exec -it nodeos /usr/bin/cleos -u http://localhost:8888 set contract eosio.token ./eosio.token -p eosio.token
Reading WASM from /eosio/eosio.token/eosio.token.wasm...
Publishing contract...
executed transaction: b46a4f64138f22af4c4e675d2567eecd4c6d7cf54695caae4986ed2beb50645d  6984 bytes  47480 us
#         eosio <= eosio::setcode               {"account":"eosio.token","vmtype":0,"vmversion":0,"code":"0061736d0100000001a0011b60000060017e006002...
#         eosio <= eosio::setabi                {"account":"eosio.token","abi":"0e656f73696f3a3a6162692f312e310008076163636f756e7400010762616c616e63...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
yujinsheng@ubuntu:~$ cleos push action eosio.token create '["eosio.token", "1000000000.0000 POG"]' -p eosio.token
executed transaction: 3fc96ed36337a198553ecd19ea1a34864a8e07a8353a23824b49f98c10e4ef96  120 bytes  15757 us
#   eosio.token <= eosio.token::create          {"issuer":"eosio.token","maximum_supply":"1000000000.0000 POG"}
warning: transaction executed locally, but may not be confirmed by the network yet         ] 
yujinsheng@ubuntu:~$ cleos push action eosio.token issue '["eosio.token", "1000000000.0000 POG", "issue"]' -p eosio.token
executed transaction: 80959a3657e127195a31ced3707b85cc77a0aedf645633190ca6e31bb4a07e4d  128 bytes  399 us
#   eosio.token <= eosio.token::issue           {"to":"eosio.token","quantity":"1000000000.0000 POG","memo":"issue"}
warning: transaction executed locally, but may not be confirmed by the network yet         ] 
yujinsheng@ubuntu:~$ cleos push action eosio.token transfer '["eosio.token", "yujinsheng11", "10000000.0000 POG", "trx"]' -p eosio.token
executed transaction: 2c48615badcc243ca967f04d089c39a9a5a0cb4daa28a3f1aab8f2bb1c025936  128 bytes  239 us
#   eosio.token <= eosio.token::transfer        {"from":"eosio.token","to":"yujinsheng11","quantity":"10000000.0000 POG","memo":"trx"}
#  yujinsheng11 <= eosio.token::transfer        {"from":"eosio.token","to":"yujinsheng11","quantity":"10000000.0000 POG","memo":"trx"}
warning: transaction executed locally, but may not be confirmed by the network yet         ] 
```

#### deploy `lockymoney` smart contract
```
yujinsheng@ubuntu:~$ docker exec -it nodeos /usr/bin/cleos -u http://localhost:8888 set contract luckyhongbao ./luckymoney -p luckyhongbao
Reading WASM from /eosio/luckymoney/luckymoney.wasm...
Publishing contract...
executed transaction: ac16b9c2a5f975c7b583f8384548edc01574f5bb53fe7784948e893c3c08c715  7656 bytes  144496 us
#         eosio <= eosio::setcode               {"account":"luckyhongbao","vmtype":0,"vmversion":0,"code":"0061736d0100000001cd012060000060057f7e7f7...
#         eosio <= eosio::setabi                {"account":"luckyhongbao","abi":"0e656f73696f3a3a6162692f312e31000505636c6561720002036b65790675696e7...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```



## 45.251.109.187
```
root@9d9bdb8b4d20:/eosio# echo "5JiaCgDfoYdgfYhXcWVKSeyqcpZYapanhKiiDt1J2amN3cd3kQ6" | cleos wallet import 
private key: imported private key for: EOS7zoVugxxczPuiPWCfNK4ErEbDEmTCoojqoo7S9RqpVQq5HkPu2
root@9d9bdb8b4d20:/eosio# cleos -u http://45.251.109.187:8888 create account yujinsheng11 luckyhongbao EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv
executed transaction: 60f056eed8d5cc2dd518921e79146aa58957dfd3295b15a08cfe1d76212e292a  200 bytes  217 us
#         eosio <= eosio::newaccount            {"creator":"yujinsheng11","name":"luckyhongbao","owner":{"threshold":1,"keys":[{"key":"EOS6xKtqbXeTw...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
root@9d9bdb8b4d20:/eosio# echo "5KQairxa939NMKHfuyQWw9tSaiSk4B787HEPvTvd1BzReANJECo" | cleos wallet import 
private key: imported private key for: EOS6xKtqbXeTwnrwgVx74dnEhNdFiSt3sYuMfJzJNmmkZz6CdQqWv
```
### 
cleos -u http://192.168.1.121:8888 set account permission yujinsheng11 active '{"threshold" : 1, "keys" : [{"key":"EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw","weight":1}], "accounts" : [{"permission":{"actor":"gametestuser","permission":"eosio.code"},"weight":1}]}' owner -p yujinsheng11@owner

cleos set account permission gametestuser active '{"threshold" : 1, "keys" : [{"key":"EOS8iGjedKoNxdHMactsAJ1F9GjJfDfgwVnFJk4bZUpVGztiFqiEw","weight":1}], "accounts" : [{"permission":{"actor":"yujinsheng11","permission":"eosio.code"},"weight":1}]}' owner -p gametestuser@owner