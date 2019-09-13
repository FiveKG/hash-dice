#!/bin/bash
#Description: run HASH_DICE service
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

export TBG_SERVER=http://192.168.1.141:9527/
export HASH_DICE_SERVER_HOST=0.0.0.0
export HASH_DICE_SERVER_PORT=13021

postgreshost=$(docker inspect postgres | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
redishost=$(docker inspect redis | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
rabbitmqhost=$(docker inspect rabbitmq | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')

dbname=hash_dice
dbuser=hash_dice_user

cat > ./config.js <<-EOF
module.exports = {
    "db" : {
        "host"    : "$postgreshost",
        "database": "$dbname",
        "user" : "$dbuser",
        "password" :  "pass_2019",
        "port"    : 5432,
    },
    "redis": {
        "host" : "$redishost",
        "port" : 6379 ,
        "auth" : "redis_pass_2018"
    },
    "rabbitmq": {
        "host": "$rabbitmqhost",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2019"
    }
}
EOF

export HASH_DICE_DB_HOST=$postgreshost
export HASH_DICE_DB_PORT=5432
export HASH_DICE_DB_USER=$dbuser
export HASH_DICE_DB_PASS=pass_2019
export HASH_DICE_DB_NAME=$dbname

export HASH_DICE_REDIS_HOST=$redishost
export HASH_DICE_REDIS_PORT=6379
export HASH_DICE_REDIS_PASS=redis_pass_2018

export HASH_DICE_RABBIT_HOST=$rabbitmqhost
export HASH_DICE_RABBIT_PORT=5672
export HASH_DICE_RABBIT_USER=mq_user
export HASH_DICE_RABBIT_PASS=pass_2019

node hash_dice.js