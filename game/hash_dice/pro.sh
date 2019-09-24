#!/bin/bash
#Description: run tbg service
unset HASH_DICE_DB_HOST
unset HASH_DICE_DB_PORT
unset HASH_DICE_DB_USER
unset HASH_DICE_DB_PASS
unset HASH_DICE_DB_NAME
unset HASH_DICE_REDIS_HOST
unset HASH_DICE_REDIS_PORT
unset HASH_DICE_REDIS_PASS
unset HASH_DICE_RABBIT_HOST
unset HASH_DICE_RABBIT_PORT
unset HASH_DICE_RABBIT_USER
unset HASH_DICE_RABBIT_PASS

export TBG_SERVER=http://pog.tbg.isecsp.com
export HASH_DICE_SERVER_HOST=0.0.0.0
export HASH_DICE_SERVER_PORT=13022

export HASH_DICE_DB_HOST=127.0.0.1
export HASH_DICE_DB_PORT=54321
export HASH_DICE_DB_USER=wallet_tbg_user
export HASH_DICE_DB_PASS=pass_2019
export HASH_DICE_DB_NAME=wallet_tbg_db

export HASH_DICE_REDIS_HOST=127.0.0.1
export HASH_DICE_REDIS_PORT=6380
export HASH_DICE_REDIS_PASS=iueksefPOSDds123DW

export HASH_DICE_RABBIT_HOST=172.18.0.2
export HASH_DICE_RABBIT_PORT=5672
export HASH_DICE_RABBIT_USER=mq_user
export HASH_DICE_RABBIT_PASS=pass_2019

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi

pm2 start pm2.json