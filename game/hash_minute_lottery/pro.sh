#!/bin/bash
#Description: run tbg service
unset HASH_MINUTE_LOTTERY_DB_HOST
unset HASH_MINUTE_LOTTERY_DB_PORT
unset HASH_MINUTE_LOTTERY_DB_USER
unset HASH_MINUTE_LOTTERY_DB_PASS
unset HASH_MINUTE_LOTTERY_DB_NAME
unset HASH_MINUTE_LOTTERY_REDIS_HOST
unset HASH_MINUTE_LOTTERY_REDIS_PORT
unset HASH_MINUTE_LOTTERY_REDIS_PASS
unset HASH_MINUTE_LOTTERY_RABBIT_HOST
unset HASH_MINUTE_LOTTERY_RABBIT_PORT
unset HASH_MINUTE_LOTTERY_RABBIT_USER
unset HASH_MINUTE_LOTTERY_RABBIT_PASS

export TBG_SERVER=http://pog.tbg.isecsp.com
export HASH_MINUTE_LOTTERY_SERVER_HOST=0.0.0.0
export HASH_MINUTE_LOTTERY_SERVER_PORT=13024

export HASH_MINUTE_LOTTERY_DB_HOST=127.0.0.1
export HASH_MINUTE_LOTTERY_DB_PORT=54321
export HASH_MINUTE_LOTTERY_DB_USER=wallet_tbg_user
export HASH_MINUTE_LOTTERY_DB_PASS=pass_2019
export HASH_MINUTE_LOTTERY_DB_NAME=wallet_tbg_db

export HASH_MINUTE_LOTTERY_REDIS_HOST=127.0.0.1
export HASH_MINUTE_LOTTERY_REDIS_PORT=6380
export HASH_MINUTE_LOTTERY_REDIS_PASS=iueksefPOSDds123DW

export HASH_MINUTE_LOTTERY_RABBIT_HOST=172.18.0.2
export HASH_MINUTE_LOTTERY_RABBIT_PORT=5672
export HASH_MINUTE_LOTTERY_RABBIT_USER=mq_user
export HASH_MINUTE_LOTTERY_RABBIT_PASS=pass_2019

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi

node hash_minute_lottery.js