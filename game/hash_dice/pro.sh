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

export HASH_DICE_DB_HOST=192.168.92.128
export HASH_DICE_DB_PORT=5432
export HASH_DICE_DB_USER=hash_dice_user
export HASH_DICE_DB_PASS=pass_2019
export HASH_DICE_DB_NAME=hash_dice

export HASH_DICE_REDIS_HOST=192.168.1.115
export HASH_DICE_REDIS_PORT=6379
export HASH_DICE_REDIS_PASS=redis_pass_2018

export HASH_DICE_RABBIT_HOST=192.168.1.115
export HASH_DICE_RABBIT_PORT=5672
export HASH_DICE_RABBIT_USER=mq_user
export HASH_DICE_RABBIT_PASS=pass_2018

cat > ./config.js <<EOF
module.exports = {
    "db" : {
        "host"    : "192.168.92.128",  
        "database": "hash_dice",
        "user"    : "hash_dice_user",
        "password": "pass_2019",
        "port"    : 5432,
    },
    "redis": {
        "host" : "192.168.1.115",
        "port" : 6379,
        "auth" : "redis_pass_2018"
    },
    "rabbitmq": {
        "host": "192.168.1.115",
        "port": 5672,
        "user": "mq_user",
        "pwd" : "pass_2018"
    } 
}
EOF

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi


pm2 start pm2.json