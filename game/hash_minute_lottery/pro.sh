#!/bin/bash
#Description: run tbg service
unset TBG_DB_HOST
unset TBG_DB_PORT
unset TBG_DB_USER
unset TBG_DB_PASS
unset TBG_DB_NAME
unset TBG_REDIS_HOST
unset TBG_REDIS_PORT
unset TBG_REDIS_PASS
unset TBG_RABBIT_HOST
unset TBG_RABBIT_PORT
unset TBG_RABBIT_USER
unset TBG_RABBIT_PASS

export TBG_SERVER=http://pog.tbg.isecsp.com
export GLOBAL_LOTTO_SERVER_HOST=0.0.0.0
export GLOBAL_LOTTO_SERVER_PORT=13024

export TBG_DB_HOST=127.0.0.1
export TBG_DB_PORT=54321
export TBG_DB_USER=wallet_tbg_user
export TBG_DB_PASS=pass_2019
export TBG_DB_NAME=wallet_tbg_db

export TBG_REDIS_HOST=127.0.0.1
export TBG_REDIS_PORT=6380
export TBG_REDIS_PASS=iueksefPOSDds123DW

export TBG_RABBIT_HOST=172.18.0.2
export TBG_RABBIT_PORT=5672
export TBG_RABBIT_USER=mq_user
export TBG_RABBIT_PASS=pass_2019

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi

node hash_minute_lottery.js
