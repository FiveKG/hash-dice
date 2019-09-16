#!/bin/bash
#Description: run SNATCH_TREASURE service
unset SNATCH_TREASURE_DB_HOST
unset SNATCH_TREASURE_DB_PORT
unset SNATCH_TREASURE_DB_USER
unset SNATCH_TREASURE_DB_PASS
unset SNATCH_TREASURE_DB_NAME
unset SNATCH_TREASURE_REDIS_HOST
unset SNATCH_TREASURE_REDIS_PORT
unset SNATCH_TREASURE_REDIS_PASS
unset SNATCH_TREASURE_RABBIT_HOST
unset SNATCH_TREASURE_RABBIT_PORT
unset SNATCH_TREASURE_RABBIT_USER
unset SNATCH_TREASURE_RABBIT_PASS

export TBG_SERVER=http://192.168.1.141:9527/
export SNATCH_TREASURE_SERVER_HOST=0.0.0.0
export SNATCH_TREASURE_SERVER_PORT=13025

postgreshost=$(docker inspect postgres | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
redishost=$(docker inspect redis | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
rabbitmqhost=$(docker inspect rabbitmq | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')

dbname=snatch_treasure
dbuser=snatch_treasure_user

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

export SNATCH_TREASURE_DB_HOST=$postgreshost
export SNATCH_TREASURE_DB_PORT=5432
export SNATCH_TREASURE_DB_USER=$dbuser
export SNATCH_TREASURE_DB_PASS=pass_2019
export SNATCH_TREASURE_DB_NAME=$dbname

export SNATCH_TREASURE_REDIS_HOST=$redishost
export SNATCH_TREASURE_REDIS_PORT=6379
export SNATCH_TREASURE_REDIS_PASS=redis_pass_2018

export SNATCH_TREASURE_RABBIT_HOST=$rabbitmqhost
export SNATCH_TREASURE_RABBIT_PORT=5672
export SNATCH_TREASURE_RABBIT_USER=mq_user
export SNATCH_TREASURE_RABBIT_PASS=pass_2019

node snatch_treasure.js