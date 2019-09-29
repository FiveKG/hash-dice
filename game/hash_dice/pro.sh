#!/bin/bash
#Description: run GLOBAL_LOTTO service
unset GLOBAL_LOTTO_DB_HOST
unset GLOBAL_LOTTO_DB_PORT
unset GLOBAL_LOTTO_DB_USER
unset GLOBAL_LOTTO_DB_PASS
unset GLOBAL_LOTTO_DB_NAME
unset GLOBAL_LOTTO_REDIS_HOST
unset GLOBAL_LOTTO_REDIS_PORT
unset GLOBAL_LOTTO_REDIS_PASS
unset GLOBAL_LOTTO_RABBIT_HOST
unset GLOBAL_LOTTO_RABBIT_PORT
unset GLOBAL_LOTTO_RABBIT_USER
unset GLOBAL_LOTTO_RABBIT_PASS

postgreshost=127.0.0.1
redishost=127.0.0.1
rabbitmqhost=172.18.0.2

dbname=hash_dice
dbuser=hash_dice_user

export TBG_SERVER=http://pog.tbg.isecsp.com
export HASH_DICE_SERVER_HOST=0.0.0.0
export HASH_DICE_SERVER_PORT=13022

export HASH_DICE_DB_HOST=127.0.0.1
export HASH_DICE_DB_PORT=54321
export HASH_DICE_DB_USER=hash_dice_user
export HASH_DICE_DB_PASS=pass_2019
export HASH_DICE_DB_NAME=hash_dice

export HASH_DICE_REDIS_HOST=127.0.0.1
export HASH_DICE_REDIS_PORT=6380
export HASH_DICE_REDIS_PASS=iueksefPOSDds123DW

export HASH_DICE_RABBIT_HOST=172.18.0.2
export HASH_DICE_RABBIT_PORT=5672
export HASH_DICE_RABBIT_USER=mq_user
export HASH_DICE_RABBIT_PASS=pass_2019

cat > ./config.js <<-EOF
module.exports = {
    "db" : {
        "host"    : "$postgreshost",
        "database": "$dbname",
        "user" : "$dbuser",
        "password" :  "pass_2019",
        "port"    : 54321,
    },
    "redis": {
        "host" : "$redishost",
        "port" : 6380 ,
        "auth" : "iueksefPOSDds123DW"
    },
    "rabbitmq": {
        "host": "$rabbitmqhost",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2019"
    }
}
EOF
pm2 start pm2.json

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi

pm2 start pm2.json