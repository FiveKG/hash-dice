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

export TBG_SERVER=http://192.168.1.164:9527/
export GLOBAL_LOTTO_SERVER_HOST=0.0.0.0
export GLOBAL_LOTTO_SERVER_PORT=13021

postgreshost=$(docker inspect postgres | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
redishost=$(docker inspect redis | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
rabbitmqhost=$(docker inspect rabbitmq | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')

dbname=global_lotto
dbuser=global_lotto_user

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

export GLOBAL_LOTTO_DB_HOST=$postgreshost
export GLOBAL_LOTTO_DB_PORT=5432
export GLOBAL_LOTTO_DB_USER=$dbuser
export GLOBAL_LOTTO_DB_PASS=pass_2019
export GLOBAL_LOTTO_DB_NAME=$dbname

export GLOBAL_LOTTO_REDIS_HOST=$redishost
export GLOBAL_LOTTO_REDIS_PORT=6379
export GLOBAL_LOTTO_REDIS_PASS=redis_pass_2018

export GLOBAL_LOTTO_RABBIT_HOST=$rabbitmqhost
export GLOBAL_LOTTO_RABBIT_PORT=5672
export GLOBAL_LOTTO_RABBIT_USER=mq_user
export GLOBAL_LOTTO_RABBIT_PASS=pass_2019

node global_lotto.js